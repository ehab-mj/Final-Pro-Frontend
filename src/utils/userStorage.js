const getUserId = () => {
    const savedUser = localStorage.getItem('pc-store-user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    return user?.id || 'guest';
};

export function getUserOrders() {
    const userId = getUserId();
    const saved = localStorage.getItem(`pc-store-orders-${userId}`);
    return saved ? JSON.parse(saved) : [];
}

export function saveUserOrder(order) {
    const userId = getUserId();
    const orders = getUserOrders();
    const updatedOrders = [order, ...orders];

    localStorage.setItem(`pc-store-orders-${userId}`, JSON.stringify(updatedOrders));
    return updatedOrders;
}

export function getSavedBuilds() {
    const userId = getUserId();
    const saved = localStorage.getItem(`pc-store-saved-builds-${userId}`);
    return saved ? JSON.parse(saved) : [];
}

export function saveBuild(build) {
    const userId = getUserId();
    const builds = getSavedBuilds();
    const updatedBuilds = [build, ...builds];

    localStorage.setItem(`pc-store-saved-builds-${userId}`, JSON.stringify(updatedBuilds));
    return updatedBuilds;
}

export function getWishlist() {
    const userId = getUserId();
    const saved = localStorage.getItem(`pc-store-wishlist-${userId}`);
    return saved ? JSON.parse(saved) : [];
}

export function addToWishlist(product) {
    const userId = getUserId();
    const wishlist = getWishlist();

    const exists = wishlist.some((item) => item._id === product._id);

    if (exists) return wishlist;

    const updatedWishlist = [product, ...wishlist];

    localStorage.setItem(
        `pc-store-wishlist-${userId}`,
        JSON.stringify(updatedWishlist)
    );

    return updatedWishlist;
}

export function removeFromWishlist(productId) {
    const userId = getUserId();
    const wishlist = getWishlist();

    const updatedWishlist = wishlist.filter((item) => item._id !== productId);

    localStorage.setItem(
        `pc-store-wishlist-${userId}`,
        JSON.stringify(updatedWishlist)
    );

    return updatedWishlist;
}


export function updateOrderStatus(orderId, newStatus) {
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('pc-store-orders-')) {
            const orders = JSON.parse(localStorage.getItem(key)) || [];

            const updatedOrders = orders.map((order) =>
                order.id === orderId
                    ? { ...order, status: newStatus }
                    : order
            );

            localStorage.setItem(key, JSON.stringify(updatedOrders));
        }
    });
}


export function deleteSavedBuild(buildId) {
    const userId = getUserId();
    const builds = getSavedBuilds();

    const updatedBuilds = builds.filter((build) => build.id !== buildId);

    localStorage.setItem(
        `pc-store-saved-builds-${userId}`,
        JSON.stringify(updatedBuilds)
    );

    return updatedBuilds;
}