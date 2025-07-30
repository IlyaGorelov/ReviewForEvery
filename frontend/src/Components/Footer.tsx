export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center text-gray-600 py-4 mt-12 border-t">
      <p className="text-sm">
        © {new Date().getFullYear()} ReviewForEvery. Все права защищены.
      </p>
    </footer>
  );
}