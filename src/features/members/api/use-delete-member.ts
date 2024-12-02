import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.members)[":memberId"]["$delete"], 200>;
type RequestType = InferRequestType<(typeof client.api.members)[":memberId"]["$delete"]>;

export const useDeleteMember = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ param }) => { //it was ({json}) but it was changed to handle uploading image
			

			const response = await client.api.members[":memberId"]["$delete"]({
				param,
			});

			if (!response.ok) {
				throw new Error("Failed to delete member");
			}

			return await response.json();
		},
		onSuccess: () => {
			toast.success("Member deleted");
			queryClient.invalidateQueries({ queryKey: ["members"] });
			// queryClient.invalidateQueries({ queryKey: ["member" , data.$id] });
		},
		onError: () => {
			toast.error("Failed to delete member");
		},
	});
	return mutation;
};