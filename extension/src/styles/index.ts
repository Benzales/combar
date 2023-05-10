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
        backgroundColor: "rgba(173, 216, 230, 0.5)",
        zIndex: "2147483647",
        resize: "none",
    }
}