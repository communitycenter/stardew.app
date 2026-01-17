import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Optional, Tuple
from urllib.parse import unquote, urlparse

ROOT_DIR = Path(__file__).resolve().parents[1]
APP_DIR = ROOT_DIR / "apps" / "stardew.app"
ENV_PATH = APP_DIR / ".env.local"
EXAMPLE_PATH = APP_DIR / ".env.local.example"


def read_env_value(path: Path, key: str) -> Optional[str]:
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[len("export ") :]
        if "=" not in line:
            continue
        env_key, value = line.split("=", 1)
        if env_key.strip() != key:
            continue
        value = value.strip().split("#")[0]
        if value and value[0] == value[-1] and value[0] in ('"', "'"):
            value = value[1:-1]
        return value
    return None


def resolve_mysql_client() -> Tuple[Optional[str], Optional[str]]:
    mysql_bin = shutil.which("mysql")
    mysqlsh_bin = shutil.which("mysqlsh")

    if mysql_bin:
        version = subprocess.run(
            [mysql_bin, "--version"],
            capture_output=True,
            text=True,
        )
        output = f"{version.stdout} {version.stderr}".lower()
        if "mysql shell" in output:
            return "mysqlsh", mysqlsh_bin or mysql_bin
        return "mysql", mysql_bin

    if mysqlsh_bin:
        return "mysqlsh", mysqlsh_bin

    return None, None


def create_database(database_url: str) -> int:
    parsed = urlparse(database_url)
    db_name = unquote(parsed.path.lstrip("/"))
    if not db_name:
        print("DATABASE_URL must include a database name.", file=sys.stderr)
        return 1
    host = parsed.hostname or "localhost"
    port = parsed.port
    username = unquote(parsed.username) if parsed.username else None
    password = unquote(parsed.password) if parsed.password else None

    client_type, client_path = resolve_mysql_client()
    if not client_path or not client_type:
        print(
            "MySQL client not found in PATH. Install mysql (or mysqlsh) and add it to PATH.",
            file=sys.stderr,
        )
        return 1

    statement = (
        f"CREATE DATABASE IF NOT EXISTS `{db_name}` "
        "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    )
    env = os.environ.copy()

    if client_type == "mysqlsh":
        userinfo = ""
        if username:
            userinfo = username
            if password:
                userinfo += f":{password}"
            userinfo += "@"
        hostinfo = f"{host}:{port}" if port else host
        uri = f"{userinfo}{hostinfo}"
        cmd = [client_path, "--sql", "--uri", uri, "-e", statement]
        result = subprocess.run(cmd, cwd=str(ROOT_DIR), env=env)
        return result.returncode

    cmd = [client_path]
    if host:
        cmd.extend(["-h", host])
    if port:
        cmd.extend(["-P", str(port)])
    if username:
        cmd.extend(["-u", username])
    if password and "MYSQL_PWD" not in env:
        env["MYSQL_PWD"] = password
    cmd.extend(["-e", statement])

    result = subprocess.run(cmd, cwd=str(ROOT_DIR), env=env)
    return result.returncode


def run_drizzle_push() -> int:
    local_bin = (
        ROOT_DIR
        / "node_modules"
        / ".bin"
        / ("drizzle-kit.cmd" if os.name == "nt" else "drizzle-kit")
    )
    if os.name == "nt":
        cmd = (
            [str(local_bin), "push"]
            if local_bin.exists()
            else ["npx.cmd", "-y", "drizzle-kit", "push"]
        )
        result = subprocess.run(
            [
                "cmd.exe",
                "/c",
                *cmd,
            ],
            cwd=str(ROOT_DIR),
            env=os.environ,
        )
        return result.returncode

    cmd = (
        [str(local_bin), "push"]
        if local_bin.exists()
        else ["npx", "-y", "drizzle-kit", "push"]
    )
    result = subprocess.run(cmd, cwd=str(ROOT_DIR), env=os.environ)
    return result.returncode


def main() -> int:
    if not ENV_PATH.exists():
        message = (
            f"Missing {ENV_PATH}. Copy {EXAMPLE_PATH} to {ENV_PATH}, "
            "update the values, and ensure your local SQL server is running."
        )
        print(message, file=sys.stderr)
        return 1

    database_url = read_env_value(ENV_PATH, "DATABASE_URL")
    if not database_url:
        print(
            f"Missing DATABASE_URL in {ENV_PATH}. Update the file and ensure your local SQL server is running.",
            file=sys.stderr,
        )
        return 1

    os.environ["DATABASE_URL"] = database_url
    db_result = create_database(database_url)
    if db_result != 0:
        return db_result

    print("Syncing schema with drizzle-kit...")
    return run_drizzle_push()


if __name__ == "__main__":
    raise SystemExit(main())
