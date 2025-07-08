// This is only used for monster slayer goals so it's not very reusable

import * as z from "zod";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePlayers } from "@/contexts/players-context";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreatePlayerRedirect } from "@/components/createPlayerRedirect";

import { ChevronRightIcon } from "@radix-ui/react-icons";
interface Props {
  title: string;
  completed?: boolean;
  currentValue?: number;
  maxValue: number;
  targets: string[];
}

export const InputCard = ({
  title,
  completed,
  currentValue,
  maxValue,
  targets,
}: Props) => {
  const [value, setValue] = useState(0);

  const inputSchema = z.object({
    input: z.coerce.number().min(10),
  });

  const form = useForm({
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

  const { activePlayer, patchPlayer } = usePlayers();

  const [open, setOpen] = useState(false);

  let checkedClass = completed
    ? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "flex select-none items-center justify-between space-x-3 truncate rounded-lg border border-neutral-200 bg-white px-5 py-4 text-neutral-950 shadow-sm hover:cursor-pointer dark:text-neutral-50",
            checkedClass,
          )}
        >
          <div className="flex items-center space-x-3 truncate text-left">
            <Image
              src={`https://cdn.stardew.app/images/(MSQ)${title}.webp`}
              alt={title}
              width={32}
              height={32}
              className="h-8 w-auto rounded-sm"
              quality={25}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{title}</p>
              <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                {currentValue ? currentValue : 0}/{maxValue}
              </p>
            </div>
          </div>
          <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-neutral-500 dark:text-neutral-400" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Image
            src={`https://cdn.stardew.app/images/(MSQ)${title}.webp`}
            alt={title}
            className="mx-auto rounded-sm"
            width={36}
            height={36}
            quality={25}
          />
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            This number can be found in the Adventurer&apos;s Guild.
          </DialogDescription>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="space-y-4">
            <ul className="list-inside list-disc">
              {targets.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <Form {...form}>
              <form
                className="w-full space-y-6"
                onSubmit={(e) => e.preventDefault()}
              >
                <FormField
                  name="input"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <div className="flex w-2/3 items-center space-x-2">
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              defaultValue={currentValue ?? 0}
                              onChange={(e) =>
                                setValue(parseInt(e.target.value))
                              }
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
          </div>
        </DialogDescription>
        {!activePlayer && <CreatePlayerRedirect />}
      </DialogContent>
    </Dialog>
  );
};
