import { useState } from "react";

export default function DeletePostIcon({ postId }) {
  const [error, setError] = useState(null);

  async function handleDeletePost(e) {
    e.preventDefault();
    console.log("in delete post, calling fetch now");
    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    });
    console.log("back from fetch");
    if (res.status === 201 || res.status === 200) {
      location.reload();
    } else {
      const data = await res.json();
      setError(data.error);
    }
  }
  return (
    <>
      <svg
        className="send-icon m-3"
        data-bs-toggle="modal"
        data-bs-target="#deleteModal"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>

      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleDeletePost}>
            <div className="modal-header">
              <h1 className="modal-title fs-5">Delete this post?</h1>
              <button
                type="button"
                className="btn-close pointer-cursor"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="d-flex p-3 gap-3">
              <button
                type="button"
                className="btn btn-danger btn"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button className="btn btn-success" type="submit">
                Yes
              </button>
            </div>
            <div>{error}</div>
          </form>
        </div>
      </div>
    </>
  );
}
