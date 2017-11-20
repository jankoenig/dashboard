let id = 0;

interface ToastOptions {
};

const defaultOptions = {
};

export default function createToast(options: ToastOptions) {
    return {
        ...defaultOptions,
        ...options,
        id: id++
    };
};
