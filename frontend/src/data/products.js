const API_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/products`
    : "http://localhost:5000/api/products";

async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue.");
    }

    return data;
}

export async function fetchProducts() {
    const response = await fetch(API_URL);
    return handleResponse(response);
}

export async function createProduct(payload) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function updateProduct(id, payload) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function deleteProduct(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    return handleResponse(response);
}