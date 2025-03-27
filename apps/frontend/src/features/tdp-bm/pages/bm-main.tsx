import React, { useEffect, useState } from "react";
import { fetchNotebook } from "../utils/utils";
interface NotebookCellOutput {
  data?: {
      ["image/png"]?: string; 
  };
}

interface NotebookCell {
  cell_type: string;
  outputs?: NotebookCellOutput[];
}

interface NotebookJson {
  cells: NotebookCell[];
}

const BmMain: React.FC = () => {
  const [graphs, setGraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
      async function loadImages() {
          try {
            const notebook: NotebookJson = await fetchNotebook();
            const imgList: string[] = [];
        
            notebook.cells.forEach((cell: NotebookCell) => {
                if (cell.cell_type === "code" && cell.outputs) {
                    cell.outputs.forEach((output: NotebookCellOutput) => {
                        if (output.data && output.data["image/png"]) {
                            const imageData = `data:image/png;base64,${output.data["image/png"]}`;
                            imgList.push(imageData);
                        }
                    });
                }
            });
        
            setGraphs(imgList);
        } catch (error) {
            console.error("Error fetching notebook images:", error);
        }
       finally {
              setLoading(false);
          }
      }

      loadImages();
  }, []);

  return (
      <div className="p-8">
          <h1 className="text-2xl font-bold text-[#5C5C5D] mb-6">Benchmarking Module</h1>

          {loading ? (
              <p className="text-center text-gray-500">Loading graphs...</p>
          ) : graphs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {graphs.map((graph, index) => (
                      <div key={index} className="bg-white p-6 shadow-lg rounded-lg flex justify-center">
                          <img
                              src={graph}
                              alt={`Graph ${index + 1}`}
                              className="w-full max-h-[500px] object-contain rounded-lg"
                          />
                      </div>
                  ))}
              </div>
          ) : (
              <p className="text-center text-gray-500">No graphs found in the notebook.</p>
          )}
      </div>
  );
};

export default BmMain
