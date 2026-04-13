import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/contexts/AuthContext';
import { ldapApi, type LdapUser } from '@/lib/api';
import { UserRole } from '@/types';
import ExcelJS from 'exceljs';
import {
	ChevronLeft,
	ChevronRight,
	FileSpreadsheet,
	MapPin,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 50;

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
	user: '',
	location: '',
	email: '',
	functionTitle: '',
};

const LdapList: React.FC<LdapListProps> = ({
	filters = defaultFilters,
}) => {
	const { user, removeAuth } = useAuth();
	const [users, setUsers] = useState<LdapUser[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	const API_URL = import.meta.env.VITE_API_URL;

	if (user && user.role !== UserRole.ADMIN) {
		return <Navigate to={'/access-denied'} replace />;
	}

	useEffect(() => {
		const fetchData = async () => {
			if (!API_URL) {
				setError('API_URL non configurée.');
				setLoading(false);
				return;
			}
			try {
				setLoading(true);
				setError(null); // On réinitialise l'erreur au début
				const data = await ldapApi.list();
				setUsers(data);
				setLoading(false);
			} catch (err: any) {
				console.error('Erreur API:', err);

				// ✅ GESTION DOUCE : On informe l'utilisateur sans le déconnecter
				if (err.response?.status === 401) {
					setError(
						'Session LDAP invalide ou droits insuffisants (401).',
					);
				} else if (err.response?.status === 403) {
					setError(
						"Accès refusé : vous n'avez pas les permissions nécessaires (403).",
					);
				} else {
					setError(
						"Impossible de charger l'annuaire Active Directory.",
					);
				}

				setLoading(false);
			}
			removeAuth();
		};
		fetchData();
	}, [API_URL]); // Ajout de API_URL en dépendance par sécurité

	useEffect(() => {
		setCurrentPage(1);
	}, [filters]);

	const filteredUsers = users.filter((u) => {
		const fullname = (
			u.fullname || `${u.firstname} ${u.lastname}`
		).toLowerCase();
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
		currentPage * ITEMS_PER_PAGE,
	);

	const getPageNumbers = () => {
		const pages: (number | '...')[] = [];
		if (totalPages <= 7)
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		pages.push(1);
		if (currentPage > 3) pages.push('...');
		for (
			let i = Math.max(2, currentPage - 1);
			i <= Math.min(totalPages - 1, currentPage + 1);
			i++
		) {
			pages.push(i);
		}
		if (currentPage < totalPages - 2) pages.push('...');
		pages.push(totalPages);
		return pages;
	};

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

		worksheet.getRow(1).eachCell((cell) => {
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FF1F2937' },
			};
			cell.font = {
				bold: true,
				color: { argb: 'FFFFFFFF' },
				size: 10,
			};
			cell.alignment = { vertical: 'middle', horizontal: 'center' };
		});

		filteredUsers.forEach((u) => {
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
		const blob = new Blob([buffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `annuaire_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.xlsx`;
		a.click();
		URL.revokeObjectURL(url);
	};

	if (loading) {
		return <Loader label="Chargement des annuaires..." />;
	}

	const TABLE_ROWS = [
		'Nom & Prénom',
		'Fonction',
		'Email',
		'Téléphone',
		'Flotte',
		'Localisation',
	];

	return (
		<main className="bg-white border border-gray-200 shadow-sm overflow-hidden text-left rounded">
			{/* 1. BARRE D'OUTILS */}
			<div className="p-3 flex justify-between items-center bg-white border-b border-gray-100">
				<Button
					variant="success"
					icon={<FileSpreadsheet size={14} />}
					onClick={handleExportExcel}
					className="cursor-pointer"
				>
					Excel
				</Button>

				<div className="flex items-center gap-2">
					<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
						Résultats
					</span>
					<span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-black">
						{filteredUsers.length}
					</span>
				</div>
			</div>

			{/* 2. TABLEAU */}
			<div className="overflow-x-auto shadow-sm rounded-sm border border-gray-100 bg-white">
				<table className="w-full border-collapse">
					<thead>
						<tr className="bg-[#1f2937] text-white">
							{TABLE_ROWS.map((header, index) => (
								<th
									key={index}
									className="p-3 text-[10px] font-bold uppercase tracking-widest border-r border-gray-700/50 text-left"
								>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{paginatedUsers.map((u, index) => (
							<tr
								key={index}
								className="hover:bg-[#FFC107] transition-colors duration-150 cursor-default group text-sm"
							>
								<td className="p-3 font-bold text-gray-900 uppercase tracking-tighter border-r border-gray-100/50">
									{u.fullname ||
										`${u.firstname} ${u.lastname}`}
								</td>
								<td className="p-3 text-gray-600 italic text-xs group-hover:text-gray-900 transition-colors border-r border-gray-100/50">
									{u.function || 'N/A'}
								</td>
								<td className="p-3 border-r border-gray-100/50">
									{u.mail || u.email ? (
										<a
											href={`mailto:${u.mail || u.email}`}
											className="flex items-center gap-2 text-blue-700 hover:text-blue-950 hover:underline cursor-pointer transition-all"
										>
											<span className="text-xs font-medium">
												{u.mail || u.email}
											</span>
										</a>
									) : (
										<span className="text-gray-400 text-xs italic">
											Non renseigné
										</span>
									)}
								</td>
								<td className="p-3 text-gray-600 text-xs font-mono group-hover:text-gray-900 border-r border-gray-100/50">
									{u.landline || '-'}
								</td>
								<td className="p-3 border-r border-gray-100/50">
									<div className="flex items-center gap-2 text-infranet font-bold text-[11px] whitespace-nowrap group-hover:text-gray-900">
										{u.phone || '-'}
									</div>
								</td>
								<td className="p-3">
									<div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border border-gray-100 text-[11px] text-gray-700 whitespace-nowrap group-hover:bg-white/50 group-hover:border-gray-200 group-hover:text-gray-900 transition-all">
										<MapPin
											size={12}
											className="text-gray-400 group-hover:text-gray-700"
										/>
										{u.location || 'N/A'}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* 3. PAGINATION ET ERREURS */}
			{totalPages > 1 && (
				<div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap bg-white">
					<span className="text-[11px] text-gray-400 font-bold">
						Page {currentPage} sur {totalPages} —{' '}
						{filteredUsers.length} résultats
					</span>
					<div className="flex items-center gap-1">
						<button
							onClick={() =>
								setCurrentPage((p) => Math.max(1, p - 1))
							}
							disabled={currentPage === 1}
							className="h-8 px-2 flex items-center gap-1 text-[12px] font-medium bg-black text-[#fbbb01] border border-black rounded hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						>
							<ChevronLeft size={14} /> Précédent
						</button>
						{getPageNumbers().map((page, i) =>
							page === '...' ? (
								<span
									key={`dots-${i}`}
									className="h-8 w-8 flex items-center justify-center text-gray-400 text-xs"
								>
									…
								</span>
							) : (
								<button
									key={page}
									onClick={() =>
										setCurrentPage(page as number)
									}
									className={`h-8 w-8 flex items-center justify-center text-[12px] font-medium rounded border transition-colors
                    ${
						currentPage === page
							? 'bg-[#fbbb01] border-[#fbbb01] text-black font-bold'
							: 'bg-black border-black text-[#fbbb01] hover:bg-gray-800'
					}`}
								>
									{page}
								</button>
							),
						)}
						<button
							onClick={() =>
								setCurrentPage((p) =>
									Math.min(totalPages, p + 1),
								)
							}
							disabled={currentPage === totalPages}
							className="h-8 px-2 flex items-center gap-1 text-[12px] font-medium bg-black text-[#fbbb01] border border-black rounded hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						>
							Suivant <ChevronRight size={14} />
						</button>
					</div>
				</div>
			)}

			{filteredUsers.length === 0 && !error && (
				<div className="p-12 text-center text-gray-400 italic text-sm">
					Aucune donnée trouvée
				</div>
			)}

			{error && (
				<div className="p-12 text-center text-red-500 font-bold text-xs uppercase bg-red-50 border-t border-red-100">
					{error}
				</div>
			)}
		</main>
	);
};

export default LdapList;
