"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

const page = () => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { loginToast } = useCustomToast();

  // make a request to the API endpoint to create a community
  const { mutate: createCommunity, isLoading } = useMutation({
    // any function that handles data fetching
    mutationFn: async () => {
      // enforce type safety on payload
      const payload: CreateSubredditPayload = {
        name: input,
      };
      const { data } = await axios.post("/api/subreddit", payload);
      return data as string;
    },
    onError: (error) => {
      // if error is an AxiosError we can check status
      if (error instanceof AxiosError) {
        // subreddit already exists
        if (error.response?.status === 409) {
          return toast({
            title: "This subreadit already exists.",
            description: "Please choose a different subreadit name",
            variant: "destructive",
          });
        }

        // ZodError, invalid string
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid subreadit name",
            description: "Please choose a name between 3 and 21 characters.",
            variant: "destructive",
          });
        }

        // Unauthorized, user is not logged in
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      toast({
        title: "There was an error.",
        description: "Could not create subreadit.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      router.push(`/b/${data}`)
    }
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-wgite w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a Subreadit</h1>
        </div>
        <hr className="bg-zinc-500 h-1px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              b/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="subtle" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            Create Subreadit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
