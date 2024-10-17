"use client"
import React, { useState, useRef, useEffect } from 'react';
import { FaFan, FaTrash, FaArrowLeft, FaEdit } from "react-icons/fa";
import { HiOutlinePhotograph, HiShoppingBag } from "react-icons/hi";
import { BsInfinity } from "react-icons/bs";
import { PiDotsNineBold } from "react-icons/pi";

interface FilterItem {
  text: string;
  type: 'condition' | 'operator' | 'value';
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
        { text: 'image_list.Product Image 2', type: 'condition' },
        { text: 'is empty', type: 'operator' },
        { text: 'AND Discount Percentage', type: 'condition' },
        { text: 'is', type: 'operator' },
        { text: '0', type: 'value' },
      ],
      variants: [null, null, null, null]
    },
    {
      id: 2,
      filter: [
        { text: 'tags', type: 'condition' },
        { text: 'contains', type: 'operator' },
        { text: 'onsale', type: 'value' },
      ],
      variants: [null, null, null, null]
    }
  ]);

  const [columns, setColumns] = useState<number>(4);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollLeft = gridRef.current.scrollWidth;
    }
  }, [columns]);

  const addState = () => {
    const newState: State = {
      id: states.length + 1,
      filter: [{ text: 'New Filter', type: 'condition' }],
      variants: Array(columns).fill(null)
    };
    setStates([...states, newState]);
  };

  const deleteState = (id: number) => {
    setStates(states.filter(state => state.id !== id));
  };

  const addVariantColumn = () => {
    setColumns(prev => prev + 1);
    setStates(states.map(state => ({
      ...state,
      variants: [...state.variants, null]
    })));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
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
    // Simulate file selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataUrl = e.target?.result as string;
          setStates(states.map(state => {
            if (state.id === stateId) {
              const newVariants = [...state.variants];
              newVariants[variantIndex] = { image: imageDataUrl, title: file.name };
              return { ...state, variants: newVariants };
            }
            return state;
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="main min-h-screen flex w-full ">
      {/* Sidebar */}
      <div className="left w-[5%] bg-black flex flex-col items-center text-white justify-between text-2xl">
        <div className="top space-y-10">
          <FaFan className=" mt-32 text-green-500" />
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

        <div className="w-[90%] mx-auto bg-gray-200 rounded-lg flex gap-4">
          {/* Left section: Numbers and Filters */}
          <div className="left w-[40%] flex">
            {/* Numbers Column */}
            <div className="left-left numbersColumn w-[40%] pt-20 pb-10">
              {states.map((state, index) => (
                <div
                  key={state.id}
                  className="h-40 flex flex-col items-center justify-center cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <FaTrash className="text-red-500 cursor-pointer mb-2" onClick={() => deleteState(state.id)} />
                  <div className="flex items-center justify-center">
                    <span className="mr-2 text-2xl">{index + 1}</span>
                    <PiDotsNineBold className='text-2xl'/>
                  </div>
                </div>
              ))}
              <div className="h-40 flex flex-col items-center justify-center cursor-pointer" onClick={addState}>
                <h1 className="text-3xl">+</h1>
              </div>
            </div>

            {/* Filters Column */}
            <div className="left-right FiltersColumn w-full text-center mt-10 space-y-2">
              <h1 className="text-gray-700 mb-4">Product Filter</h1>
              {states.map((state) => (
                <div
                  key={state.id}
                  className="h-40 flex flex-col items-center justify-center bg-white p-4 overflow-y-auto"
                >
                  {state.filter.map((item, i) => (
                    <span 
                      key={i} 
                      className={`inline-block px-2 py-1 rounded-md mr-1 mb-1 text-xs font-medium
                        ${item.type === 'condition' ? 'bg-blue-100 text-blue-800 ' : 
                          item.type === 'operator' ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                    >
                      {item.text}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right section: Grid Layout with Scrollbar */}
          <div className="right w-[50%] overflow-hidden">
            <div 
              ref={gridRef}
              className="overflow-x-auto"
              style={{
                maxWidth: '800px',
                overflowX: columns > 4 ? 'scroll' : 'hidden'
              }}
            >
              {/* Header Row */}
              <div className="flex mb-2 mt-8" style={{ width: `${columns * 200}px` }}>
                {Array.from({ length: columns }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 w-[200px]">
                    <h1 className="text-gray-700">{index === 0 ? 'Primary' : `Variant ${index + 1}`}</h1>
                    <PiDotsNineBold className="text-gray-500" />
                  </div>
                ))}
              </div>

              {/* Grid Items */}
              <div style={{ width: `${columns * 200}px`, borderRadius:"10px" }}>
                {states.map((state) => (
                  <div key={state.id} className="flex gap-2 mb-2 rounded-md">
                    {state.variants.map((variant, variantIndex) => (
                      <div
                        key={variantIndex}
                        className="w-[200px] h-40 flex flex-col items-center justify-center bg-white relative rounded-md"
                      >
                        {variant ? (
                          <>
                            <img src={variant.image} alt={variant.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-75 p-2 text-xs">
                              {variant.title}
                            </div>
                            <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
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
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plus Signs Section */}
          <div className="flex flex-col justify-evenly items-center w-[10%]">
            <div className="h-40 flex items-center justify-center">
              <h1 className="text-4xl bg-gray-100 cursor-pointer p-2 rounded" onClick={addVariantColumn}>+</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateTable;