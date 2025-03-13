import React, { useEffect, useRef, useState } from "react";

const Complaint = () => {
  const [complaint, setComplaint] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");

  const onSubmit = () => {
    console.log("complaint:", complaint);
  };

  const textAreaRef = useRef(null);
  const debouncedRef = useRef(null);

  const focusTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  const fetchSuggestions = (text: string) => {
    const start = new Date();
    if (text.trim().length) {
      fetch(`http://localhost:8080/api/v1/ai/completion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('data:', data);
          const end = new Date();
          console.log('time taken:', end.getTime() - start.getTime())
          setAiSuggestion(data?.displayText); // Update this line to match your JSON structure
        })
        .catch((error) => {
          console.error("Error fetching AI text:", error);
        });
    }
  };

  const isCursorAtEnd = () => {
    const selection = window.getSelection();
    return true;
    //@ts-ignore
    // return selection?.anchorOffset === selection?.anchorNode!.length;
  };

  
  const acceptSuggestion = () => {};
  let enterPressed = false;
  const handleInput = (e: any) => {
    let newText = e?.target.innerText;
    if (enterPressed && newText.endsWith("\n\n")) {
      // Remove the last newline character
      newText = newText.slice(0, -1);

      // Reset the flag
      enterPressed = false;
    }
    setComplaint(newText);
    setAiSuggestion("");
    console.log('newText:', newText)
    if (isCursorAtEnd()) {
      //@ts-ignore
      clearTimeout(debouncedRef.current);
      //@ts-ignore
      debouncedRef.current = setTimeout(
        () => fetchSuggestions(newText),
        1500
      );
    }
  };

  const handleKeyDown = (e) => {};

  return (
    <div className="flex items-center justify-center mt-24">
      <form onSubmit={onSubmit}>
        <div
          onClick={focusTextArea}
          className="w-[600px] h-24 overflow-auto p-4 border shadow-lg cursor-text rounded-lg text-left"
        >
          <span
            ref={textAreaRef}
            className="border-0 text-xs outline-none"
            contentEditable={true}
            suppressContentEditableWarning={true}
            onInput={(e) => handleInput(e)}
            onKeyDown={handleKeyDown}
          >
            {/* {userText} */}
          </span>
          <span
            contentEditable={false}
            className={`text-xs text-gray-600 transition-opacity duration-300 ${
              aiSuggestion ? "opacity-100" : "opacity-0"
            }`}
          >
            {aiSuggestion?.length > 0 && (
              <>
                {aiSuggestion}
                <span
                  onClick={() => {
                    acceptSuggestion();
                  }}
                  className="border p-1.5 py-0.5 text-[10px] ml-1 inline-block w-fit rounded-md border-gray-300 cursor-pointer"
                >
                  Tab
                </span>
              </>
            )}
          </span>
        </div>
        <div className="flex justify-center my-4">
          <button
            type="submit"
            className="border bg-blue-400 hover:bg-blue-600 text-white my-2 p-2 rounded-lg "
          >
            submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Complaint;
