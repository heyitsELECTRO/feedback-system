import { FaCheck } from 'react-icons/fa';
export default function Logo() {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-black w-10 h-10">
      <span className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
        <FaCheck className="text-black w-5 h-5" />
      </span>
    </span>
  );
}