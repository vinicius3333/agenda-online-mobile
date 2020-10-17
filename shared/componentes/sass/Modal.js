const modalCss = () => {
    return {
        modalOverlay: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
        },
        modalBackground: {
            flex: 1,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#00000040",
        },
        modalContent: {
            backgroundColor: "#FFFFFF",
            minHeight: 150,
            width: 300,
            borderRadius: 10,
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "auto",
            marginBottom: "auto",
            alignItems: "center",
            padding: 24
        }
    }
}

export default modalCss()