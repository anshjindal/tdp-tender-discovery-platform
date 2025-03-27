// iPynb notebook to be fetched from Github
export const notebookUrl = "https://raw.githubusercontent.com/pvlefang/TDP-BM-Tender-Discovery-Platform---Benchmarking-/main/Copy_of_Government_Tender_Bids_Analysis.ipynb";

export async function fetchNotebook() {
    const response = await fetch(notebookUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch notebook");
    }
    return response.json();
}
