'use client';

import React, { useContext, useState } from 'react';
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce';
import { demoMode } from '@/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GearIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Github, LogOut } from 'lucide-react';
import Loading from '../ui/loading';

interface Links {
  href: string;
  label: string;
}

export function MainNav({ children }: React.HTMLAttributes<HTMLElement>) {
  const { logOut, loginInProgress, token, tokenData } =
    useContext<IAuthContext>(AuthContext);
  const userName = demoMode
    ? 'Uncle Scrooge'
    : tokenData?.preferred_username ?? '';

  const [loggingOut, setLoggingOut] = useState(false);

  const links: Links[] = [{ href: '/', label: 'Home' }];

  if (token || demoMode) {
    links.push({ href: '/dashboards', label: 'Dashboards' });
    links.push({ href: '/overview', label: 'Overview' });
  }

  const logout = () => {
    if (demoMode) return;

    setLoggingOut(true);
    localStorage.clear();
    logOut();
  };

  return (
    <>
      <div className="sticky top-0 bg-gray-950 z-50">
        <div className="flex-col md:flex">
          <div className="border-b">
            <div className="flex justify-between items-center w-full">
              <div className="w-full flex h-16 items-center px-4 mx-6 lg:mx-12">
                <nav className="w-full">
                  <div className="flex flex-row justify-between gap-3">
                    <div className="flex flex-row align-center py-2 gap-2">
                      {links.map((link) => {
                        return (
                          <a
                            key={link.href}
                            href={link.href}
                            className={
                              window.location.pathname === link.href
                                ? 'text-sm font-medium text-slate-200 transition-colors focus:outline-none'
                                : 'text-sm font-medium text-muted-foreground transition-colors hover:text-slate-600 focus:outline-none'
                            }
                          >
                            {link.label}
                          </a>
                        );
                      })}
                    </div>
                    <div className="flex flex-row justify-around gap-6">
                      {((!loginInProgress && token) || demoMode) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground transition-colors hover:text-slate-600 focus:outline-none">
                            {userName}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem className="cursor-pointer text-muted-foreground">
                              <a
                                className="flex flex-row align-middle"
                                href="/settings"
                              >
                                Settings
                                <GearIcon className="ml-9 w-4 h-4" />
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
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
                          <TooltipTrigger className="rounded w-4 flex justify-center items-center hover:text-gray-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ">
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
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Loading loading={loggingOut}>{children}</Loading>
    </>
  );
}

export default MainNav;
