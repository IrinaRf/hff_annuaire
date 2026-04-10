import logoInfranet from '@/assets/images/logoHFF.png';
import { Link } from 'react-router-dom'; 
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { ChevronDown, LogOut, ShieldCheck, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [userName, setUserName] = useState('Utilisateur');
	const [userRole, setUserRole] = useState<string>('COLLABORATEUR');
	const { user, logout } = useAuth();

	useEffect(() => {
		if (user) {
			setUserName(user.fullname || user.username || 'Utilisateur');
			setUserRole(
				user.role === UserRole.ADMIN ? 'ADMIN' : 'COLLABORATEUR',
			);
		} else {
			setUserName('Utilisateur');
			setUserRole('COLLABORATEUR');
		}
	}, [user]);

	const handleLogout = () => {
		logout();
	};

return (
        <header className="bg-[#1f2937] shadow-md p-4 flex justify-between items-center border-b-4 border-infranet z-50 font-sans sticky top-0">
            <div className="flex items-center">
                {/* Logo cliquable qui pointe vers la racine */}
                <Link 
                    to="/" 
                    className="transition-all hover:opacity-80 active:scale-95"
                    title="Retour à l'accueil"
                >
                    <img
                        src={logoInfranet}
                        alt="Logo Infranet"
                        className="h-12 w-auto object-contain"
                    />
                </Link>
            </div>

            <div className="relative">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-sm border border-gray-600 transition-all shadow-inner"
				>
					<div className="bg-infranet p-1.5 rounded-full text-gray-900 shadow-sm">
						<User size={16} strokeWidth={3} />
					</div>
					<span className="text-xs font-bold uppercase tracking-wider">
						{userName}
					</span>
					<ChevronDown
						size={14}
						className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
					/>
				</button>

				{isOpen && (
					<>
						<div
							className="fixed inset-0 z-[-1]"
							onClick={() => setIsOpen(false)}
						></div>
						<div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-2xl rounded-sm py-1 animate-in fade-in slide-in-from-top-2 duration-200">
							<div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
								<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
									Ma Session
								</p>
								<div className="flex items-center gap-2">
									<span
										className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm
                    ${
						userRole.toUpperCase() === 'ADMIN'
							? 'bg-red-100 text-red-700 border border-red-200'
							: 'bg-blue-100 text-blue-700 border border-blue-200'
					}`}
									>
										<ShieldCheck size={10} />
										{userRole}
									</span>
								</div>
							</div>

							<div className="p-1">
								<button
									onClick={handleLogout}
									className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-sm transition-colors text-left uppercase tracking-tighter"
								>
									<LogOut size={14} />
									Déconnexion
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</header>
	);
};

export default Header;
