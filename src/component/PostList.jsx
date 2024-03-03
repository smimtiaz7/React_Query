import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { addPost, fetchPost } from "../Api/api";
import { useState } from "react";

const PostList = () => {
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: () => fetchPost(page),
    staleTime: 1000 * 60 * 5,
  });

  const { mutate } = useMutation({
    mutationFn: addPost,
    onSubmit: () => {
      return { id: 3 };
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ title: state });
    setState("");
  };

  console.log(data);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Write your post..."
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <button>Post</button>
      </form>
      {isLoading && <h2>Loading...</h2>}
      {data?.data &&
        data?.data?.map((post) => <h3 key={post.id}>{post.title}</h3>)}
      <button
        disabled={!data?.prev}
        onClick={() => setPage((p) => Math.max(p - 1, 0))}
      >
        prev
      </button>
      <span>{page}</span>
      <button disabled={!data?.next} onClick={() => setPage((p) => p + 1)}>
        next
      </button>
    </div>
  );
};

export default PostList;
