import { useState, useRef, useEffect } from "react";

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

export const useStateTable = () => {
  const [states, setStates] = useState<State[]>([
    {
      id: 1,
      filter: [
        { text: "image_list.ProductImage2", type: "condition" },
        { text: "isEmpty", type: "operator" },
        { text: "AND Discount Percentage", type: "condition" },
        { text: "is", type: "operator" },
        { text: "0", type: "value" },
      ],
      variants: [null, null],
    },
    {
      id: 2,
      filter: [
        { text: "tags", type: "condition" },
        { text: "contains", type: "operator" },
        { text: "onsale", type: "value" },
      ],
      variants: [null, null],
    },
  ]);

  const [columns, setColumns] = useState<number>(2);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

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

  const deleteVariantColumn = (index: number) => {
    if (index === 0 || index >= columns) return; 
    setColumns((prev) => prev - 1);
    setStates(
      states.map((state) => ({
        ...state,
        variants: state.variants.filter((_, i) => i !== index),
      }))
    );
    setSelectedColumn(null);
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

    filter.forEach((item) => {
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

  return {
    states,
    columns,
    selectedRow,
    selectedColumn,
    gridRef,
    addState,
    deleteState,
    addVariantColumn,
    deleteVariantColumn,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    addDesign,
    renderFilterContent,
    setSelectedRow,
    setSelectedColumn,
  };
};