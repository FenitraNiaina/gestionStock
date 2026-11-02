const API_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/sales`
    : "http://localhost:5000/api/sales";

async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue.");
    }

    return data;
}

export async function fetchSales() {
    const response = await fetch(API_URL);
    return handleResponse(response);
}

export async function createSale(payload) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function updateSale(id, payload) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function deleteSale(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    return handleResponse(response);
}

export async function validateSale(id) {
    const response = await fetch(`${API_URL}/${id}/validate`, {
        method: "PATCH",
    });
    return handleResponse(response);
}

export async function cancelSale(id) {
    const response = await fetch(`${API_URL}/${id}/cancel`, {
        method: "PATCH",
    });
    return handleResponse(response);
}