const API_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/purchases`
    : "http://localhost:5000/api/purchases";

async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue.");
    }

    return data;
}

export async function fetchPurchases() {
    const response = await fetch(API_URL);
    return handleResponse(response);
}

export async function createPurchase(payload) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function updatePurchase(id, payload) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function deletePurchase(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    return handleResponse(response);
}

export async function receivePurchase(id) {
    const response = await fetch(`${API_URL}/${id}/receive`, {
        method: "PATCH",
    });
    return handleResponse(response);
}

export async function changePurchaseStatus(id, status) {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
}