const deleteProduct = async(id) => {
    try {
        const response = await fetch(`http://localhost:8080/productos/${id}`, {
         method:"DELETE"
         });
         location.reload()
    } catch (error) {
       console.log(error);
    }
}