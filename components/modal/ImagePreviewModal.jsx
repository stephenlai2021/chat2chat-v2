/* react-icons */
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoCloseCircleOutline } from "react-icons/io5";

/* next */
import Image from "next/image";

export default function ImagePreviewModal({
  id,
  closeAndClearModal,
  handleUpload,
  imagePreview,
  uploadProgress,
  message,
  setMessage,
  inputFile,
  handleFileChange,
  showUploadBtn,
  from,
}) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        {/* close button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={closeAndClearModal}
        >
          ✕
        </button>

        <div className="pt-2 relative flex flex-col justify-center items-center">
          {/* image preview section */}
          {imagePreview && (
            <div className="relative">
              <div className="flex justify-center relative">
                {/* upload icon */}
                {showUploadBtn && (
                  <div className="backdrop-opacity-30 backdrop-invert bg-base-100/30 rounded-full p-1 w-16 h-16 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] hover:cursor-pointer">
                    <AiOutlineCloudUpload
                      className="text-base-content w-full h-full"
                      onClick={handleUpload}
                    />
                  </div>
                )}

                {/* image preview */}
                <Image
                  src={imagePreview}
                  alt="Uploaded"
                  width={200}
                  height={200}
                  className="mb-4 rounded"
                />

                {/* radial progress */}
                {uploadProgress !== null && (
                  <div
                    className="w-16 h-16 backdrop-opacity-30 backdrop-invert bg-base-100/30 radial-progress text-base-content absolute z-[500] top-[50%] translate-y-[-50%]"
                    style={{ "--value": uploadProgress }}
                    role="progressbar"
                  >
                    {uploadProgress.toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
          )}

          {/* message input && file input */}
          {/* <div> */}
          <div className="relative">
            {imagePreview && from == "MessageInput" && message && (
              <div className="border- absolute left-1 top-[50%] translate-y-[-50%] py-2 px-1">
                <IoCloseCircleOutline
                  className="w-[20px] h-[20px] hover:cursor-pointer text-base-content"
                  onClick={() => setMessage("")}
                />
              </div>
            )}

            {/* message input */}
            {imagePreview && from == "MessageInput" && (
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Caption(optional)"
                className={`bg-base-300 rounded-md input-m ${
                  message ? "pl-8" : "pl-4"
                } pr-4 py-3 w-full max-w-xs text-base-content`}
              />
            )}
          </div>

          {/* file input */}
          <input
            type="file"
            accept="image/*"
            ref={inputFile}
            className="mt-2 file-input file-input-bordered file-input-primary text-base-content w-full max-w-xs"
            onChange={handleFileChange}
          />
          {/* </div> */}
        </div>
      </div>
    </dialog>
  );
}
