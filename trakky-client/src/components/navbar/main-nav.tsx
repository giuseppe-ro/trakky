import { demoMode } from '@/constants';
import { useAuth } from 'react-oidc-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ResetIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Cog,
  Github,
  HomeIcon,
  LogOut,
  BarChart2,
  HandCoins,
} from 'lucide-react';
import getUser from '@/infrastructure/user';
import { HTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';
import { skipAuth } from '@/authConfig';
import { resetLocalDb } from '@/infrastructure/local/db';

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
    links.push({ href: '/split', label: 'Split' });
    links.push({ href: '/settings', label: 'Settings' });
  }

  const getTabIcon = (item: string) => {
    switch (item) {
      case 'Home':
        return <HomeIcon className="h-6 w-6" />;
      case 'Dashboards':
        return <BarChart2 className="h-6 w-6" />;
      case 'Split':
        return <HandCoins className="h-6 w-6" />;
      case 'Settings':
        return <Cog className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const logout = async () => {
    if (demoMode) return;
    localStorage.clear();
    await auth.signoutRedirect();
  };

  const resetLocalDatabase = async () => {
    await resetLocalDb();
    window.location.reload();
  };

  return (
    <>
      <nav className="sticky z-50 top-0 border-b bg-secondary">
        <div className="mx-auto max-w-7xl min-w-[300px] px-0 sm:px-2">
          <div className="relative flex h-8 sm:h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center m-6 sm:items-stretch sm:justify-start">
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/';
                }}
                className="flex flex-shrink-0 items-center"
              >
                <div className="flex flex-row items-center sm:ml-0">
                  <img alt="Trakky" src="owl_login.png" className="h-6 w-6" />
                  <div className="text-primary text-lg ml-2">Trakky</div>
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
                          'rounded-md px-4 py-4 text-sm font-medium transition-all focus:outline-primary-foreground',
                          window.location.pathname === link.href
                            ? 'bg-background text-primary'
                            : 'text-muted-foreground hover:bg-primary-foreground hover:text-primary'
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
                  <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground transition-colors hover:text-muted-foreground/50 focus:outline-none">
                    {userName}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex flex-col justify-between">
                    <DropdownMenuItem
                      className="cursor-pointer w-[100%] text-muted-foreground"
                      disabled={demoMode}
                      onClick={logout}
                    >
                      <div className="flex w-[100%] justify-between">
                        <div>Logout</div>
                        <LogOut className="w-4 h-4 ml-11" />
                      </div>
                    </DropdownMenuItem>
                    {demoMode && (
                      <DropdownMenuItem
                        className="cursor-pointer w-[100%] text-muted-foreground"
                        onClick={resetLocalDatabase}
                      >
                        <div className="flex w-[100%] justify-between">
                          <div>Reset Demo Data</div>
                          <ResetIcon className="w-4 h-4 ml-11" />
                        </div>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="rounded ml-4 w-4 flex justify-center items-center focus-visible:outline-none focus-visible:ring-[0px] mr-2 sm:mr-4">
                    <a
                      href="https://github.com/Joe85gr/trakky"
                      className="cursor-pointer inline-flex items-center justify-center text-muted-foreground hover:text-muted-foreground/50 h-8 py-2"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Source Code"
                    >
                      <Github className="h-4 w-4 transition-all" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary-foreground text-primary">
                    Source Code
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </nav>
      {links.length > 1 && (
        <nav className="z-50 fixed inset-x-0 bottom-0 sm:hidden bg-secondary flex-row items-center justify-around visible md:invisible w-full text-2xl">
          <div className="flex flex-row justify-center align-middle">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className={twMerge(
                  'block px-3 py-2 text-base w-full font-medium',
                  window.location.pathname === link.href
                    ? 'bg-primary-foreground text-primary border border-b-0 border-secondary-foreground/30'
                    : 'text-muted-foreground/50 hover:bg-primary-foreground/50',
                  'rounded-t-md',
                  index === 0 && 'rounded-tl-none border-l-0',
                  index === links.length - 1 && 'rounded-tr-none border-r-0'
                )}
              >
                <div className="flex flex-col">
                  <div className="flex justify-center">
                    {getTabIcon(link.label)}
                  </div>
                  <span className="text-sm text-center">{link.label}</span>
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
