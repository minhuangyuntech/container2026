import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'

type RouterValue = {
  pathname: string
  navigate: (to: string, options?: { replace?: boolean }) => void
}

const RouterContext = createContext<RouterValue | null>(null)
const ParamsContext = createContext<Record<string, string>>({})

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '')
  return hash.startsWith('/') ? hash : '/'
}

export function HashRouter({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(currentPath)

  useEffect(() => {
    const update = () => setPathname(currentPath())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  const value = useMemo<RouterValue>(() => ({
    pathname,
    navigate: (to, options) => {
      const target = to.startsWith('/') ? to : `/${to}`
      if (options?.replace) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`)
        setPathname(target)
      } else if (currentPath() === target) {
        setPathname(target)
      } else {
        window.location.hash = target
      }
    },
  }), [pathname])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

function useRouter() {
  const router = useContext(RouterContext)
  if (!router) throw new Error('Router components must be rendered inside HashRouter')
  return router
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }

export function Link({ to, onClick, children, ...props }: LinkProps) {
  const { navigate } = useRouter()
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
  }
  return <a href={`#${to}`} onClick={handleClick} {...props}>{children}</a>
}

type NavLinkProps = Omit<LinkProps, 'className'> & {
  end?: boolean
  className?: string | ((state: { isActive: boolean }) => string)
}

export function NavLink({ to, end = false, className, ...props }: NavLinkProps) {
  const { pathname } = useRouter()
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)
  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className
  return <Link to={to} className={resolvedClassName} {...props} />
}

type RouteProps = { path: string; element: ReactElement }
export function Route(_: RouteProps) { return null }

function matchPath(pattern: string, pathname: string) {
  if (pattern === '*') return { matched: true, params: {} }
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)
  if (patternParts.length !== pathParts.length) return { matched: false, params: {} }
  const params: Record<string, string> = {}
  for (let index = 0; index < patternParts.length; index += 1) {
    const expected = patternParts[index]
    const actual = pathParts[index]
    if (expected.startsWith(':')) params[expected.slice(1)] = decodeURIComponent(actual)
    else if (expected !== actual) return { matched: false, params: {} }
  }
  return { matched: true, params }
}

export function Routes({ children }: { children: ReactNode }) {
  const { pathname } = useRouter()
  for (const child of Children.toArray(children)) {
    if (!isValidElement<RouteProps>(child)) continue
    const match = matchPath(child.props.path, pathname)
    if (match.matched) return <ParamsContext.Provider value={match.params}>{child.props.element}</ParamsContext.Provider>
  }
  return null
}

export function Navigate({ to, replace = false }: { to: string; replace?: boolean }) {
  const { navigate } = useRouter()
  useEffect(() => navigate(to, { replace }), [navigate, replace, to])
  return null
}

export function useLocation() {
  const { pathname } = useRouter()
  return { pathname }
}

export function useNavigate() {
  return useRouter().navigate
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string>>() {
  return useContext(ParamsContext) as T
}
