import { createSignal } from 'solid-js';
import { NavLink } from 'solid-app-router';
import classnames from 'classnames';
import ecoIconUrl from '../assets/eco-icon.ico';
import Dropdown from '../components/Dropdown';

type Props = {
  routes: Array<{
    href: string;
    text: string;
    description: string;
    highlight: boolean;
  }>;
};
const OS = 'os';
const DARK = 'dark';
const LIGHT = 'light';
const isSystemDark = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;
const updateThemeEffect = (theme: string) => {
  localStorage.theme = theme;
  let themeClass = theme !== OS ? theme : isSystemDark() ? DARK : LIGHT;
  document.documentElement.className = themeClass;
};
export default (props: Props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);
  const [theme, setTheme] = createSignal(
    !('theme' in localStorage) ? OS : localStorage.theme
  );
  const updateTheme = (newTheme: string) => {
    // We need to update our signal as well as change classes in document and update localstorage in case user reloads page
    setTheme(newTheme);
    updateThemeEffect(newTheme);
  };
  // initialize classes and localstate
  updateThemeEffect(theme());
  return (
    <nav class="bg-bgColor-secondary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img class="h-8 w-8" src={ecoIconUrl} alt="Workflow" />
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                {props.routes.map((route) => (
                  <NavLink
                    href={route.href}
                    end
                    class={classnames(
                      'bg-bgColor-secondary text-textColor px-3 py-2 rounded-md text-sm font-medium ',
                      {
                        'bg-bgColor-secondary-hover text-textColor-secondary':
                          route.highlight,
                        'hover:bg-bgColor-secondary-hover hover: text-textColor-secondary':
                          !route.highlight,
                      }
                    )}
                    aria-current={route.highlight ? 'page' : undefined}
                  >
                    {route.text}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Dropdown
              value={theme()}
              values={[
                { value: OS, text: 'System theme' },
                { value: LIGHT, text: 'Light theme' },
                { value: DARK, text: 'Dark theme' },
              ]}
              onChange={(newValue) => updateTheme(`${newValue}`)}
              origin="SE"
              direction="SW"
            />
          </div>

          <div class="-mr-2 flex md:hidden">
            {/* <!-- Mobile menu button --> */}
            <button
              type="button"
              class="text-textColor-secondary hover:bg-bgColor-secondary-hover focus:bg-bgColor-secondary-hover inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onclick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <span class="sr-only">Open main menu</span>
              {/* <!--
            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
          --> */}
              <svg
                class={classnames('h-6 w-6', {
                  block: !mobileMenuOpen(),
                  hidden: mobileMenuOpen(),
                })}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* <!--
            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
          --> */}
              <svg
                class={classnames('h-6 w-6', {
                  block: mobileMenuOpen(),
                  hidden: !mobileMenuOpen(),
                })}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      <div
        class={classnames('md:hidden', {
          block: mobileMenuOpen(),
          hidden: !mobileMenuOpen(),
        })}
        id="mobile-menu"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {props.routes.map((route) => (
            <NavLink
              href={route.href}
              end
              class={classnames(
                'block px-3 py-2 rounded-md text-base font-medium',
                {
                  'bg-bgColor-secondary-hover text-textColor-secondary':
                    route.highlight,
                  'hover:bg-bgColor-secondary-hover hover: text-textColor-secondary':
                    !route.highlight,
                }
              )}
              aria-current={route.highlight ? 'page' : undefined}
            >
              {route.text}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
