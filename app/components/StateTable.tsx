"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaFan, FaTrash, FaArrowLeft, FaEdit } from "react-icons/fa";
import { HiOutlinePhotograph, HiShoppingBag } from "react-icons/hi";
import { BsInfinity } from "react-icons/bs";
import { PiDotsNineBold } from "react-icons/pi";
import Image from "next/image";

interface FilterItem {
  text: string;
  type: "condition" | "operator" | "value";
}

interface Variant {
  image: string;
  title: string;
}

interface State {
  id: number;
  filter: FilterItem[];
  variants: (Variant | null)[];
}

const StateTable: React.FC = () => {
  const [states, setStates] = useState<State[]>([
    {
      id: 1,
      filter: [
        { text: "image_list.Product Image 2", type: "condition" },
        { text: "is empty", type: "operator" },
        { text: "AND Discount Percentage", type: "condition" },
        { text: "is", type: "operator" },
        { text: "0", type: "value" },
      ],
      variants: [null, null, null, null],
    },
    {
      id: 2,
      filter: [
        { text: "tags", type: "condition" },
        { text: "contains", type: "operator" },
        { text: "onsale", type: "value" },
      ],
      variants: [null, null, null, null],
    },
  ]);

  const [columns, setColumns] = useState<number>(4);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollLeft = gridRef.current.scrollWidth;
    }
  }, [columns]);

  const addState = () => {
    const newState: State = {
      id: states.length + 1,
      filter: [{ text: "New Filter", type: "condition" }],
      variants: Array(columns).fill(null),
    };
    setStates([...states, newState]);
  };

  const deleteState = (id: number) => {
    setStates(states.filter((state) => state.id !== id));
    setSelectedRow(null);
  };

  const addVariantColumn = () => {
    setColumns((prev) => prev + 1);
    setStates(
      states.map((state) => ({
        ...state,
        variants: [...state.variants, null],
      }))
    );
  };

  const handleDragStart = (position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const copyStates = [...states];
      const dragItemContent = copyStates[dragItem.current];
      copyStates.splice(dragItem.current, 1);
      copyStates.splice(dragOverItem.current, 0, dragItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setStates(copyStates);
    }
  };

  const addDesign = (stateId: number, variantIndex: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataUrl = e.target?.result as string;
          setStates(
            states.map((state) => {
              if (state.id === stateId) {
                const newVariants = [...state.variants];
                newVariants[variantIndex] = {
                  image: imageDataUrl,
                  title: file.name,
                };
                return { ...state, variants: newVariants };
              }
              return state;
            })
          );
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const renderFilterContent = (filter: FilterItem[]) => {
    const lines: string[] = [];
    let currentLine = "";

    filter.forEach((item, index) => {
      if (item.type === "condition" && currentLine !== "") {
        lines.push(currentLine.trim());
        currentLine = "";
      }
      currentLine += item.text + " ";
    });

    if (currentLine !== "") {
      lines.push(currentLine.trim());
    }

    return lines;
  };

  return (
    <div className="main min-h-screen flex w-full">
      {/* Sidebar */}
      <div className="left w-[5%] bg-black flex flex-col items-center text-white justify-between text-2xl">
        <div className="top space-y-10">
          <FaFan className="mt-32 text-green-500" />
          <HiOutlinePhotograph />
          <BsInfinity />
          <HiShoppingBag />
        </div>
        <div className="space-y-10 pb-10">
          <BsInfinity />
          <HiShoppingBag />
        </div>
      </div>

      <div className="right w-[95%]">
        {/* Header */}
        <div className="nav w-full p-10 text-3xl justify-between flex">
          <div className="left flex gap-10">
            <FaArrowLeft />
            <h1>Rules Creation</h1>
          </div>
          <button className="bg-green-600 text-white text-sm p-4 rounded-md">
            Publish Feed
          </button>
        </div>

        <div className="w-[95%] mx-auto bg-gray-200 rounded-lg flex gap-4">
          {/* Left section: Numbers and Filters */}
          <div className="left w-[40%] flex">
            {/* Numbers Column */}
            <div className="left-left numbersColumn w-[40%] pt-20 pb-10 space-y-2">
              {states.map((state, index) => (
                <div
                  key={state.id}
                  className="h-40 flex flex-col items-center justify-center cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => setSelectedRow(index)}
                >
                  {selectedRow === index && (
                    <FaTrash
                      className="text-red-500 cursor-pointer mb-2"
                      onClick={() => deleteState(state.id)}
                    />
                  )}
                  <div className="flex items-center justify-center">
                    <span className="mr-2 text-2xl">{index + 1}</span>
                    <PiDotsNineBold className="text-2xl" />
                  </div>
                </div>
              ))}
              <div
                className="h-40 flex flex-col items-center justify-center cursor-pointer"
                onClick={addState}
              >
                <h1 className="text-3xl">+</h1>
              </div>
            </div>

            {/* Vertical divider */}
            <div className="w-px bg-gray-300 mx-2"></div>

            {/* Filters Column */}
            <div className="left-right FiltersColumn w-full mt-10 space-y-2 pl-4">
              <h1 className="text-gray-700 mb-4">Product Filter</h1>
              {states.map((state) => (
                <div
                  key={state.id}
                  className="h-40 rounded-md flex flex-col items-center justify-center bg-white p-4 overflow-y-auto"
                >
                  {renderFilterContent(state.filter).map((line, index) => (
                    <div key={index} className="mb-2 flex flex-wrap">
                      {line.split(" ").map((word, wordIndex) => (
                        <span
                          key={wordIndex}
                          className={`inline-block px-2 py-1 rounded-md mr-1 mb-1 text-xs font-medium
                ${
                  state.filter.find((item) => item.text === word)?.type ===
                  "condition"
                    ? "bg-blue-100 text-blue-800"
                    : state.filter.find((item) => item.text === word)?.type ===
                      "operator"
                    ? "bg-green-100 text-green-800"
                    : " text-yellow-800"
                }`}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Vertical divider */}
          <div className="w-px bg-gray-300 mx-2"></div>

          {/* Right section: Grid Layout with Scrollbar */}
          <div className="right w-[50%] overflow-hidden">
            <div
              ref={gridRef}
              className="overflow-x-auto"
              style={{
                maxWidth: "800px",
                overflowX: columns > 4 ? "scroll" : "hidden",
              }}
            >
              {/* Header Row */}
              <div
                className="flex mb-2 mt-8"
                style={{ width: `${columns * 200}px` }}
              >
                {Array.from({ length: columns }).map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center gap-3 p-2 w-[200px]">
                      <h1 className="text-gray-700">
                        {index === 0 ? "Primary" : `Variant ${index + 1}`}
                      </h1>
                      <PiDotsNineBold className="text-gray-500" />
                    </div>
                    {index < columns - 1 && (
                      <div className="w-px bg-gray-300 h-8"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Grid Items */}
              <div
                style={{ width: `${columns * 200}px`, borderRadius: "10px" }}
              >
                {states.map((state) => (
                  <div key={state.id} className="flex gap-2 mb-2 rounded-md">
                    {state.variants.map((variant, variantIndex) => (
                      <React.Fragment key={variantIndex}>
                        <div
                          className="w-[200px] h-40 flex flex-col items-center justify-center bg-white relative rounded-md"
                        >
                          {variant ? (
                            <>
                              <Image
                                src={variant.image}
                                alt={variant.title}
                                layout="fill"
                                objectFit="contain"
                                className="p-2"
                              />
                             
                              <button className="absolute top-1/2 bg-white rounded-full p-1 shadow-md">
                                <FaEdit className="text-gray-600" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => addDesign(state.id, variantIndex)}
                              className="hover:bg-gray-200 text-black p-2 rounded border border-gray-300"
                            >
                              + Add Design
                            </button>
                          )}
                        </div>
                        {variantIndex < columns - 1 && (
                          <div className="w-px bg-gray-300"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="w-px bg-gray-300 mx-2"></div>

          {/* Add Column Section */}
          <div className="flex flex-col justify-start items-center w-[10%] pt-20">
            {states.map((state) => (
              <div
                key={state.id}
                className="h-40 flex items-center justify-center"
              >
                <h1
                  className="text-4xl bg-gray-100 cursor-pointer p-2 rounded"
                  onClick={addVariantColumn}
                >
                  +
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateTable;