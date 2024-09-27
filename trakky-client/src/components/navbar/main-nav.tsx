import { demoMode } from '@/constants';
import { useAuth } from 'react-oidc-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GearIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BarChart2Icon,
  Github,
  HomeIcon,
  LogOut,
  MonitorIcon,
} from 'lucide-react';
import getUser from '@/infrastructure/user';
import { HTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';
import { skipAuth } from '@/authConfig';

interface Links {
  href: string;
  label: string;
}

export function MainNav({ children }: HTMLAttributes<HTMLElement>) {
  const auth = useAuth();
  const user = getUser();

  const userName = demoMode
    ? 'Uncle Scrooge'
    : user?.profile.preferred_username ?? '';

  const links: Links[] = [{ href: '/', label: 'Home' }];

  if (user || skipAuth) {
    links.push({ href: '/dashboards', label: 'Dashboards' });
    links.push({ href: '/overview', label: 'Overview' });
    links.push({ href: '/settings', label: 'Settings' });
  }

  const getTabIcon = (item: string) => {
    switch (item) {
      case 'Home':
        return <HomeIcon className="h-6 w-6" />;
      case 'Dashboards':
        return <BarChart2Icon className="h-6 w-6" />;
      case 'Overview':
        return <MonitorIcon className="h-6 w-6" />;
      case 'Settings':
        return <GearIcon className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const logout = async () => {
    if (demoMode) return;
    localStorage.clear();
    await auth.signoutRedirect();
  };

  return (
    <>
      <nav className="sticky z-50 top-0 border-b bg-gray-950">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-start m-6 sm:items-stretch sm:justify-start">
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/';
                }}
                className="flex flex-shrink-0 items-center"
              >
                <div className="flex flex-row sm:hidden">
                  <img alt="Trakky" src="owl_login.png" className="h-6 w-6" />
                  <div className="text-gray-300 text-lg ml-2">Trakky</div>
                </div>
              </button>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {links.map((link) => {
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        className={twMerge(
                          'rounded-md px-3 py-2 text-sm font-medium',
                          window.location.pathname === link.href
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        )}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {(skipAuth || !auth.isLoading) && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground transition-colors hover:text-slate-600 focus:outline-none">
                    {userName}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="cursor-pointer w-max text-muted-foreground"
                      disabled={demoMode}
                      onClick={logout}
                    >
                      <div>Logout</div>
                      <LogOut className="w-4 h-4 ml-11" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="rounded ml-4  w-4 flex justify-center items-center hover:text-gray-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ">
                    <a
                      href="https://github.com/Joe85gr/trakky"
                      className="cursor-pointer inline-flex items-center justify-center text-slate-600 hover:text-slate-500 h-8 py-2"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Source Code"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 text-white">
                    Source Code
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </nav>
      {links.length > 1 && (
        <nav className="z-50 fixed  inset-x-0 bottom-0 border-t-gray-900 sm:hidden bg-gray-800 flex-row items-center justify-around px-8 py-2 visible md:invisible w-full  text-2xl">
          <div className="flex flex-row justify-around align-middle">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={twMerge(
                  'block rounded-md px-3 py-2 text-base font-medium',
                  window.location.pathname === link.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <div className="flex flex-col">
                  <div className="flex justify-center">
                    {getTabIcon(link.label)}
                  </div>
                  <span className="text-sm">{link.label}</span>
                </div>
              </a>
            ))}
          </div>
        </nav>
      )}
      <div className="mb-20 scroll-mb-20">{children}</div>
    </>
  );
}

export default MainNav;
