import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
	(typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"],
	200
>;
type RequestType = InferRequestType<
	(typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
>;

export const useResetInviteCode = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ param }) => {
			//it was ({json}) but it was changed to handle uploading image

			const response = await client.api.workspaces[":workspaceId"][
				"reset-invite-code"
			]["$post"]({ param });

			if (!response.ok) {
				throw new Error("Failed to reset invite code");
			}

			return await response.json();
		},
		onSuccess: ({ data }) => {
			toast.success("Invite code reset");
			router.refresh()
			queryClient.invalidateQueries({ queryKey: ["workspaces"] });
			queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
			// console.log({data}, {data});
			// 7:37:39
		},
		onError: () => {
			toast.error("Failed to reset invite code");
		},
	});
	return mutation;
};
