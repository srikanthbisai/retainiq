"use client";
import React, { useState, useRef } from "react";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";

interface State {
  id: string;
  name: string;
  filter: string;
  variants: (string | null)[];
}

const StateTable = () => {
  const [states, setStates] = useState<State[]>([
    {
      id: "1",
      name: "State 1",
      filter: "image_list.Product Image 2 is empty AND Discount Percentage is 0",
      variants: [null, null, null],
    },
    {
      id: "2",
      name: "State 2",
      filter: "tags contains onsale",
      variants: [null, null, null],
    },
  ]);
  const [columns, setColumns] = useState(3);
  const draggedItem = useRef<State | null>(null);
  const draggedOverIndex = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, state: State) => {
    draggedItem.current = state;
    e.dataTransfer.setData("text/plain", state.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    draggedOverIndex.current = index;
    e.currentTarget.classList.add("bg-gray-200"); // Highlight row on drag over
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("bg-gray-200");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (
      draggedItem.current &&
      draggedOverIndex.current !== null &&
      draggedItem.current.id !== states[draggedOverIndex.current].id
    ) {
      const reorderedStates = [...states];
      const draggedIndex = reorderedStates.findIndex(
        (s) => s.id === draggedItem.current!.id
      );
      const [movedState] = reorderedStates.splice(draggedIndex, 1);
      reorderedStates.splice(draggedOverIndex.current, 0, movedState);
      setStates(reorderedStates);
    }

    // Clean up
    draggedItem.current = null;
    draggedOverIndex.current = null;
    e.currentTarget.classList.remove("bg-gray-200");
  };

  const addState = () => {
    const newState: State = {
      id: Date.now().toString(),
      name: `State ${states.length + 1}`,
      filter: "New filter",
      variants: Array(columns).fill(null),
    };
    setStates([...states, newState]);
  };

  const removeState = (id: string) => {
    setStates(states.filter((state) => state.id !== id));
  };

  const addColumn = () => {
    setColumns(columns + 1);
    setStates((prevStates) =>
      prevStates.map((state) => ({
        ...state,
        variants: [...state.variants, null],
      }))
    );
  };

  const removeColumn = () => {
    if (columns > 1) {
      setColumns(columns - 1);
      setStates((prevStates) =>
        prevStates.map((state) => ({
          ...state,
          variants: state.variants.slice(0, -1),
        }))
      );
    }
  };

  const handleAddDesign = (
    stateId: string,
    colIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStates((prevStates) =>
          prevStates.map((state) =>
            state.id === stateId
              ? {
                  ...state,
                  variants: state.variants.map((variant, index) =>
                    index === colIndex ? reader.result as string : variant
                  ),
                }
              : state
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rules creation</h1>
        <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          Publish Feed
        </button>
      </div>

      <div className="relative overflow-x-auto">
        <div className="min-w-max">
          {/* Header Row */}
          <div className="flex bg-gray-100">
            <div className="w-8 sticky left-0 z-20 bg-gray-200 h-10 flex items-center justify-center">#</div>
            <div className="w-64 sticky left-8 z-20 bg-gray-200 p-2 font-bold h-10 flex items-center">
              Product Filter
            </div>
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="w-64 p-2 font-bold text-center">
                {index === 0 ? "Primary Variant" : `Variant ${index + 1}`}
              </div>
            ))}
          </div>

          {/* State Rows */}
          {states.map((state, index) => (
            <div
              key={state.id}
              className="flex items-stretch border-b relative"
              draggable
              onDragStart={(e) => handleDragStart(e, state)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-8 sticky left-0 z-20 bg-white flex items-center justify-center">
                {index + 1}
              </div>
              <div className="w-64 sticky left-8 z-20 bg-white p-2">
                <div className="flex items-center h-full">
                  <FaTrash
                    className="text-red-500 cursor-pointer mr-2"
                    onClick={() => removeState(state.id)}
                  />
                  <span className="truncate">{state.filter}</span>
                </div>
              </div>

              {state.variants.map((variant, colIndex) => (
                <div key={colIndex} className="w-64 p-2">
                  <div className="relative h-40 border rounded bg-gray-50">
                    {variant ? (
                      <>
                        <img
                          src={variant}
                          alt={`Variant ${colIndex + 1}`}
                          className="object-cover w-full h-full rounded"
                        />
                        <FaEdit
                          className="absolute top-2 right-2 text-white cursor-pointer"
                          onClick={() =>
                            document.getElementById(
                              `file-upload-${state.id}-${colIndex}`
                            )?.click()
                          }
                        />
                      </>
                    ) : (
                      <button
                        className="text-blue-500"
                        onClick={() =>
                          document.getElementById(
                            `file-upload-${state.id}-${colIndex}`
                          )?.click()
                        }
                      >
                        + Add design
                      </button>
                    )}
                    <input
                      type="file"
                      id={`file-upload-${state.id}-${colIndex}`}
                      className="hidden"
                      onChange={(e) =>
                        handleAddDesign(state.id, colIndex, e)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={addState}
          className="text-blue-500 flex items-center"
        >
          <FaPlus className="mr-2" /> Add State
        </button>

        <div className="flex space-x-4">
          <button onClick={addColumn} className="text-green-500">
            <FaPlus className="mr-2" /> Add Column
          </button>
          <button onClick={removeColumn} className="text-red-500">
            <FaTrash className="mr-2" /> Remove Column
          </button>
        </div>
      </div>
    </div>
  );
};

export default StateTable;