document.querySelectorAll(".delete-medicine").forEach(function (deleteBtn) {
    deleteBtn.addEventListener("click", function (event) {
        const medicineId = event.target.getAttribute("dataid");

        axios.delete("http://localhost:3000/medicine/delete/" + medicineId)
            .then((response) => {
                console.log(response);
                alert("Medicine deleted");
                window.location = "/";
            })
            .catch(err => console.log(err));
    });
});
