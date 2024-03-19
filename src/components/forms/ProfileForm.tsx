// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "../ui/textarea";
// import { profileFormValidation } from "@/lib/Validation";
// import { useNavigate } from "react-router-dom";
// import ProfileImageUploader from "../shared/ProfileImageUploader";
// import {
//   useGetCurrentUser,
//   useUpdateUser,
// } from "@/lib/react-query/queriesAndMutation";
// import { toast } from "../ui/use-toast";
// import { useUserContext } from "@/context/AuthContext";
// import { ToastAction } from "../ui/toast";

// const ProfileForm = () => {
//   const { data: user } = useGetCurrentUser();
//   const { user: currentUser, setUser } = useUserContext();
//   const navigate = useNavigate();
//   const form = useForm<z.infer<typeof profileFormValidation>>({
//     resolver: zodResolver(profileFormValidation),
//     defaultValues: {
//       file: [],
//       name: user ? user.name : "",
//       username: user ? user.userName : "",
//       email: user ? user.email : "",
//       bio: user && user.bio !== null ? user.bio : undefined,
//     },
//   });

//   const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
//     useUpdateUser();

//   if (!user) {
//     return <div>No user data available.</div>;
//   }

//   const onSubmit = async (value: z.infer<typeof profileFormValidation>) => {
//     const updatedUser = await updateUser({
//       userId: user.$id,
//       name: value.name,
//       bio: value.bio,
//       file: value.file,
//       imageUrl: user.imageUrl || "",
//       imageId: user.imageId || "",
//     });

//     if (!updatedUser) {
//       toast({
//         variant: "destructive",
//         title: `Update user failed. Please try again.`,
//         description: "There was a problem Signing in.",
//         action: <ToastAction altText="Try again">Try again</ToastAction>,
//         className: "shad-form_ErrorMessage",
//       });
//     }

//     setUser({
//       ...currentUser,
//       name: updatedUser?.name,
//       bio: updatedUser?.bio,
//       imageUrl: updatedUser?.imageUrl,
//     });
//     return navigate(`/profile/${user.$id}`);
//   };

//   const handelCancelPost = () => {
//     navigate(`/profile/${user.$id}`);
//   };
// console.log(user);

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="flex flex-col gap-9 w-full max-w-5xl"
//       >
//         <FormField
//           control={form.control}
//           name="file"
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <ProfileImageUploader
//                   fieldChange={field.onChange}
//                   mediaUrl={user?.imageUrl}
//                 />
//               </FormControl>
//               <FormMessage className="shad-form_message" />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="shad-form_label">Name</FormLabel>
//               <FormControl>
//                 <Input type="text" className="shad-input" {...field} />
//               </FormControl>
//               <FormMessage className="shad-form_message" />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="username"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="shad-form_label">UserName</FormLabel>
//               <FormControl>
//                 <Input type="text" className="shad-input" {...field} />
//               </FormControl>
//               <FormMessage className="shad-form_message" />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="shad-form_label">Email</FormLabel>
//               <FormControl>
//                 <Input type="text" className="shad-input" {...field} />
//               </FormControl>
//               <FormMessage className="shad-form_message" />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="bio"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="shad-form_label">Bio</FormLabel>
//               <FormControl>
//                 <Textarea className="shad-textarea" {...field} />
//               </FormControl>
//               <FormMessage className="shad-form_message" />
//             </FormItem>
//           )}
//         />
//         <div className="flex gap-4 items-center justify-end">
//           <Button
//             type="button"
//             className="shad-button_dark_4"
//             onClick={handelCancelPost}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             className="shad-button_primary"
//             disabled={isLoadingUpdate}
//           >
//             Update Profile
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default ProfileForm;
