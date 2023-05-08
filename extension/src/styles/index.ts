export const selectionStyle = {
    backgroundColor: "yellow",
    color: "black",
};

export function getTextBoxStyle(topLoc: number) {
    return {
        position: "absolute",
        top: `${topLoc}px`,
        right: "0",
        padding: "10px",
        backgroundColor: "white",
        border: "1px solid black",
    }
}