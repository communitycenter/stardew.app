import { PlayersContext } from "@/contexts/players-context";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as v from "valibot";
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

  const inputSchema = v.object({
    input: v.number([v.minValue(0)]),
  });

  const form = useForm<v.Input<typeof inputSchema>>({
    resolver: valibotResolver(inputSchema),
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
        <div className="flex items-center space-x-3 truncate rounded-lg border-none border-neutral-200 bg-white px-5 py-4 text-neutral-950 shadow-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50">
          <div className="flex items-center space-x-3">
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
            className="mx-auto rounded-sm"
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
            <form
              className="w-full space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
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
                        onClick={() => {
                          handleSave();
                        }}
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
