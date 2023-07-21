"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/stores", values);
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error("Somethin went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      onClose={storeModal.onClose}
      isOpen={storeModal.isOpen}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="E-commerce"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex pt-6 space-x-2 items-center justify-end w-full">
                <Button
                  disabled={isLoading}
                  variant="outline"
                  onClick={storeModal.onClose}
                  type="button"
                >
                  Cancel
                </Button>
                <Button disabled={isLoading} type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
