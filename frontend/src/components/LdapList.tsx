import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, MapPin, Smartphone, Search, FileSpreadsheet, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import ExcelJS from 'exceljs';

const ITEMS_PER_PAGE = 20;

interface Filters {
  user: string;
  location: string;
  email: string;
  functionTitle: string;
}

interface LdapListProps {
  filters?: Filters;
}

const defaultFilters: Filters = {
  user: '', location: '', email: '', functionTitle: ''
};

const LdapList: React.FC<LdapListProps> = ({ filters = defaultFilters }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (!API_URL) {
        setError("API_URL non configurée.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur API:", err);
        setError("Impossible de charger l'annuaire Active Directory.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filteredUsers = users.filter(u => {
    const fullname = (u.fullname || `${u.firstname} ${u.lastname}`).toLowerCase();
    const location = (u.location || '').toLowerCase();
    const email = (u.mail || u.email || '').toLowerCase();
    const func = (u.function || '').toLowerCase();

    return (
      fullname.includes((filters.user || '').toLowerCase()) &&
      location.includes((filters.location || '').toLowerCase()) &&
      email.includes((filters.email || '').toLowerCase()) &&
      func.includes((filters.functionTitle || '').toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  if (loading) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4 bg-white border border-gray-200 shadow-sm">
        <Loader2 className="animate-spin text-infranet" size={40} />
        <p className="font-black text-[10px] text-gray-400 uppercase tracking-[0.3em]">Synchronisation Directory...</p>
      </div>
    );
  }

  const handleExportExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Annuaire');

  worksheet.columns = [
    { header: 'Nom & Prénom', key: 'fullname', width: 30 },
    { header: 'Fonction', key: 'function', width: 25 },
    { header: 'Email', key: 'email', width: 35 },
    { header: 'Téléphone', key: 'landline', width: 20 },
    { header: 'Flotte', key: 'phone', width: 20 },
    { header: 'Localisation', key: 'location', width: 25 },
  ];

  worksheet.getRow(1).eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  filteredUsers.forEach(u => {
    worksheet.addRow({
      fullname: u.fullname || `${u.firstname} ${u.lastname}`,
      function: u.function || 'N/A',
      email: u.mail || u.email || '',
      landline: u.landline || '-',
      phone: u.phone || '-',
      location: u.location || 'N/A',
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `annuaire_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};

  return (
    <main className="bg-white border border-gray-200 shadow-sm overflow-hidden text-left">

      {/* 1. BARRE D'OUTILS */}
      <div className="p-3 flex justify-between items-center bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Résultats</span>
          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-black">
            {filteredUsers.length}
          </span>
        </div>
        <button
  onClick={handleExportExcel}
  className="flex items-center gap-2 bg-[#1D6F42] hover:bg-[#155231] text-white px-3 py-1.5 rounded-sm font-bold text-[11px] transition-colors shadow-sm"
>
  <FileSpreadsheet size={14} />
  <span>EXPORTER EXCEL</span>
</button>
      </div>

      {/* 2. TABLEAU */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1f2937] text-white">
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider border-r border-gray-700/50">
                <div className="flex items-center justify-between gap-2">Nom & Prénom <Search size={12} className="text-gray-500" /></div>
              </th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider border-r border-gray-700/50">Fonction</th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider border-r border-gray-700/50">Email</th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider border-r border-gray-700/50">Tél</th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider border-r border-gray-700/50">Flotte</th>
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider min-w-40">Localisation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedUsers.map((u, index) => (
              <tr key={index} className="hover:bg-gray-50/80 transition-colors text-sm">
                <td className="p-3 font-bold text-gray-700 uppercase">
                  {u.fullname || `${u.firstname} ${u.lastname}`}
                </td>
                <td className="p-3 text-gray-500 italic text-xs">
                  {u.function || "N/A"}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
                    <Mail size={14} className="text-infranet" />
                    <span className="text-xs">{u.mail || u.email}</span>
                  </div>
                </td>
                <td className="p-3 text-gray-500 text-xs font-mono">
                  {u.landline || "-"}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2 text-infranet font-bold text-[11px] whitespace-nowrap">
                    <Smartphone size={13} /> {u.phone || "-"}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border border-gray-100 text-[11px] text-gray-600 whitespace-nowrap">
                    <MapPin size={12} className="text-gray-400" />
                    {u.location || "N/A"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. PAGINATION */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap bg">
          <span className="text-[11px] text-gray-400">
            Page {currentPage} sur {totalPages} — {filteredUsers.length} résultats
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2 flex items-center gap-1 text-[12px] font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} /> Précédent
            </button>
            {getPageNumbers().map((page, i) =>
              page === '...' ? (
                <span key={`dots-${i}`} className="h-8 w-8 flex items-center justify-center text-gray-400 text-xs">…</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`h-8 w-8 flex items-center justify-center text-[12px] font-medium rounded border transition-colors
                    ${currentPage === page
                      ? 'bg-[#FFC107] border-[#FFC107] text-gray-800 font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-2 flex items-center gap-1 text-[12px] font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Suivant <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {filteredUsers.length === 0 && !error && (
        <div className="p-12 text-center text-gray-400 italic text-sm">Aucune donnée trouvée</div>
      )}

      {error && (
        <div className="p-12 text-center text-red-500 font-bold text-xs uppercase bg-red-50">{error}</div>
      )}
    </main>
  );
};

export default LdapList;