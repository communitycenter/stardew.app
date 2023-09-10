import { PlayersContext } from "@/contexts/players-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreatePlayerRedirect } from "../createPlayerRedirect";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
interface Props {
  title: string;
  description?: string;
  iconURL: string;
  completed?: boolean;
  currentValue?: number;
  maxValue: number;
}

export const InputCard = ({
  title,
  iconURL,
  description,
  completed,
  currentValue,
  maxValue,
}: Props) => {
  const [value, setValue] = useState(0);

  const inputSchema = z.object({
    input: z.coerce
      .number()
      .nonnegative()
      .int()
      .max(maxValue, {
        message: `Input cannot be larger than ${maxValue}.`,
      }),
  });

  const form = useForm<z.infer<typeof inputSchema>>({
    resolver: zodResolver(inputSchema),
  });

  async function handleSave() {
    if (!activePlayer) return;

    // don't make any requests if the value hasn't changed
    if (value === currentValue || value < 0) {
      setOpen(false);
      return;
    }

    const patch = {
      monsters: {
        monstersKilled: {
          [title]: value === 0 ? 0 : value,
        },
      },
    };

    await patchPlayer(patch);
    setOpen(false);
  }

  const { activePlayer, patchPlayer } = useContext(PlayersContext);

  const [open, setOpen] = useState(false);

  let checkedClass = completed
    ? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-3 truncate rounded-lg border-none border-neutral-200 bg-white py-4 px-5 dark:border-neutral-800 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 shadow-none">
          <div className="flex space-x-3 items-center">
            <Image
              src={iconURL}
              alt={title}
              width={36}
              height={36}
              className="rounded-sm"
              quality={25}
            />
            <p className="truncate text-sm font-semibold">{title}</p>
            <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
              {currentValue ? currentValue : 0}/{maxValue}
            </p>
          </div>
          <ChevronRightIcon className="h-5 w-5" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Image
            src={iconURL}
            alt={title}
            className="rounded-sm mx-auto"
            width={36}
            height={36}
            quality={25}
          />
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogDescription>
          <Form {...form}>
            <form className="w-full space-y-6">
              <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <div className="flex w-2/3 items-center space-x-2">
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            defaultValue={currentValue ?? 0}
                            onChange={(e) => setValue(parseInt(e.target.value))}
                            disabled={!activePlayer}
                          />
                        </FormControl>

                        <p>/{maxValue}</p>
                      </div>

                      <Button
                        disabled={!activePlayer}
                        type="submit"
                        onClick={() => handleSave()}
                      >
                        Submit
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogDescription>
        {!activePlayer && <CreatePlayerRedirect />}
      </DialogContent>
    </Dialog>
  );
};
