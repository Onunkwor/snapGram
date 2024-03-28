"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { postValidation } from "@/lib/Validation";
import { useNavigate } from "react-router-dom";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutation";
import { toast } from "sonner";
import { IPost } from "@/types";
import { useUserContext } from "@/context/AuthContext";
type PostFormProps = {
  post?: IPost;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const currentUser = useUserContext();
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  const navigate = useNavigate();
  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  async function onSubmit(values: z.infer<typeof postValidation>) {
    console.log(values);

    if (post && action === "Update") {
      const updateData = {
        ...values,
        postId: post?._id,
        imageUrl: post?.imageUrl,
      };
      console.log(updateData);

      const updatedPost = await updatePost(updateData);
      if (!updatedPost) {
        toast.error("Please try again");
      }
      return navigate(`/post/${post._id}`);
    }
    const newPost = await createPost({
      ...values,
      creator: currentUser?._id || "",
      imageName: values.file[0].name,
      imageUrl: values.file[0].name,
      createdAt: Date.now(),
    });

    if (!newPost) {
      return toast.error("Please try again");
    }

    navigate("/");
  }

  const handelCancelPost = () => {
    navigate("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl || ""}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add tags(separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Art, Tech, Expression"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={handelCancelPost}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {`${action} Post`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
