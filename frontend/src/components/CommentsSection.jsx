import { useState } from "react";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import { useCreateComment, useDeleteComment } from "../hooks/useComments";
import { SendIcon, Trash2Icon, MessageSquareIcon, LogInIcon } from "lucide-react";

function CommentsSection({ productId, comments = [], currentUserId }) {     // get inputs
  const { isSignedIn } = useAuth();
  const [content, setContent] = useState("");  // use state for storing comment
  const createComment = useCreateComment();  //  use hook to create comment from useComments.js
  const deleteComment = useDeleteComment(productId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    createComment.mutate({ productId, content }, { onSuccess: () => setContent("") });    
    // .mutate = run a mutation function with these data
    // createComment.mutate({ productId, content } = POST /comments/:productId, with the content 
    // onSuccess: () => setContent("") = clear text field after comment created successfully
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquareIcon className="size-5 text-primary" />
        <h3 className="font-bold">Comments</h3>
        <span className="badge badge-neutral badge-sm">{comments.length}</span>
      </div>

      {isSignedIn ? (   
        <form onSubmit={handleSubmit} className="flex gap-2"> {/* if signed in, display text field for comment*/}
          <input
            type="text"
            placeholder="Add a comment..."
            className="input input-bordered input-sm flex-1 bg-base-200"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={createComment.isPending}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm btn-square"
            disabled={createComment.isPending || !content.trim()}
          >
            {createComment.isPending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <SendIcon className="size-4" />
            )}
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between bg-base-200 rounded-lg p-3">    {/* if not signed in, display sign in prompt */}
          <span className="text-sm text-base-content/60">Sign in to join the conversation</span>
          <SignInButton mode="modal">
            <button className="btn btn-primary btn-sm gap-1">
              <LogInIcon className="size-4" />
              Sign In
            </button>
          </SignInButton>
        </div>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto">  {/* display comments list */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-base-content/50">
            <MessageSquareIcon className="size-8 mx-auto mb-2 opacity-30" />    {/* if no comments show */}
            <p className="text-sm">No comments yet. Be first!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="chat chat-start">    {/* show all comments detail (pp, name, comment content), delete icon */}
              <div className="chat-image avatar">
                <div className="w-8 rounded-full">
                  <img src={comment.user?.imageUrl} alt={comment.user?.name} />
                </div>
              </div>

              <div className="chat-header text-xs opacity-70 mb-2">
                {comment.user?.name}
                <time className="ml-2 text-xs opacity-50">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
              </div>

              <div className="chat-bubble chat-bubble-neutral text-sm">{comment.content}</div>

              {currentUserId === comment.userId && (
                <div className="chat-footer">
                  <button
                    onClick={() =>
                      confirm("Delete?") && deleteComment.mutate({ commentId: comment.id })
                    }
                    className="btn btn-ghost btn-xs text-error"
                    disabled={deleteComment.isPending}
                  >
                    {deleteComment.isPending ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <Trash2Icon className="size-3" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentsSection;
