import { Home } from 'lucide-react';
import React from 'react';

const Breadcrumb: React.FC = () => {
	const HomePage = import.meta.env.VITE_API_URL_HOME || '/'; // Fallback vers '/' si la variable d'environnement n'est pas définie

	return (
		/* On ajoute du padding horizontal et de la marge en haut */
		<nav className="flex items-center px-4 md:px-8 mt-4 select-none">
			{/* Accueil */}

			<a
				href={HomePage}
				className="relative flex items-center gap-2 bg-[#1f2937] text-white pl-4 pr-8 py-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-700 transition-colors z-30 decoration-0"
				style={{
					clipPath:
						'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)', // Forme de flèche pointant vers la droite
					textDecoration: 'none', // Pour éviter le soulignement par défaut des liens
				}}
			>
				<Home size={13} className="text-[#fbbb01]" />
				<span className="translate-y-px">Accueil</span>
			</a>

			{/* Annuaire — actif */}
			<div
				className="relative flex items-center gap-2 bg-[#fbbb01] text-gray-900 pl-8 pr-8 py-2 text-[10px] font-bold uppercase tracking-widest -ml-3 z-10 shadow-sm"
				style={{
					clipPath:
						'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)',
				}} // Forme de flèche pointant vers la droite, avec un petit "décroché" à gauche pour se connecter visuellement à l'onglet précédent
			>
				<span className="translate-y-px">Annuaire</span>
			</div>
		</nav>
	);
};
export default Breadcrumb;
