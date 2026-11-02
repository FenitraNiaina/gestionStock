import Sidebar from "./Sidebar";

export default function MobileMenu({ isOpen, onClose }) {
    return (
        <Sidebar
            isOpen={isOpen}
            onClose={onClose}
        />
    );
}