const CART_KEY = 'pc-store-cart';

export function getCart() {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
}

export function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product) {
    const cart = getCart();

    const exists = cart.find((item) => item._id === product._id);

    if (exists) {
        const updatedCart = cart.map((item) =>
            item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );

        saveCart(updatedCart);
        return updatedCart;
    }

    const updatedCart = [...cart, { ...product, quantity: 1 }];
    saveCart(updatedCart);
    return updatedCart;
}

export function removeFromCart(productId) {
    const cart = getCart().filter((item) => item._id !== productId);
    saveCart(cart);
    return cart;
}

export function clearCart() {
    localStorage.removeItem(CART_KEY);
}

export function addBuildPackageToCart(selectedParts) {
    const cart = getCart();

    const buildParts = Object.values(selectedParts);

    const totalPrice = buildParts.reduce((sum, part) => {
        return sum + Number(part.price || 0);
    }, 0);


    const buildPackage = {
        _id: `build-${Date.now()}`,
        type: 'build-package',
        name: 'Custom PC Build',
        category: 'PC Build',
        brand: 'BUILD RIG',
        price: totalPrice,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80',
        parts: buildParts,
    };

    const updatedCart = [...cart, buildPackage];
    saveCart(updatedCart);

    return updatedCart;
}

export function addSavedBuildToCart(build) {
    const cart = getCart();
    const buildParts = build.parts || [];

    const totalPrice =
        Number(build.totalPrice || 0) ||
        buildParts.reduce((sum, part) => {
            return sum + Number(part.price || 0);
        }, 0);

    const buildPackage = {
        _id: `saved-build-${Date.now()}`,
        type: 'build-package',
        name: build.name || 'Saved PC Build',
        category: 'PC Build',
        brand: 'BUILD RIG',
        price: totalPrice,
        quantity: 1,
        imageUrl:
            'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80',
        parts: buildParts,
    };

    const updatedCart = [...cart, buildPackage];
    saveCart(updatedCart);

    return updatedCart;
}