import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, totalElements, size, onPageChange }) {
  const from = totalElements === 0 ? 0 : page * size + 1
  const to = Math.min((page + 1) * size, totalElements)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
      <p className="text-sm text-gray-600">
        Mostrando <span className="font-medium">{from}–{to}</span> de{' '}
        <span className="font-medium">{totalElements}</span> registros
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-3 py-1 text-sm font-medium text-gray-700">
          {page + 1} / {Math.max(totalPages, 1)}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
