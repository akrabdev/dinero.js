import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { tree } from '../data';
import { Heading } from '../utils';
import { Logo } from '../components';
import { Sitemap } from '../utils/sitemap';

type SidebarItemProps = {
  node: Sitemap;
  level: number;
  onClick: () => void;
  isNodeActive: (node: Sitemap) => boolean;
  buttonProps: Pick<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'aria-expanded' | 'aria-controls' | 'id'
  >;
};

function SidebarItem({
  node,
  level,
  onClick,
  isNodeActive,
  buttonProps,
}: SidebarItemProps) {
  const { path, label } = node.resource || {};
  const isActive = isNodeActive(node);
  const isRootLevel = level === 1;

  if (path && node.children.length === 0) {
    return (
      <Link href={`/docs${path}`}>
        <a style={{ color: isActive ? 'green' : 'inherit' }}>{label}</a>
      </Link>
    );
  }

  if (isRootLevel) {
    return (
      <button onClick={onClick} {...buttonProps}>
        {label}
      </button>
    );
  }

  return <span>{label}</span>;
}

type SidebarNodeWrapper = {
  children: React.ReactNode;
  node: Sitemap;
};

function SidebarNodeWrapper({ children, node }: SidebarNodeWrapper) {
  if (node.resource?.label) {
    return <li>{children}</li>;
  }

  return <>{children}</>;
}

type SidebarNodeProps = {
  node: Sitemap;
  level: number;
  isNodeActive: (node: Sitemap) => boolean;
};

function SidebarNode({ node, level, isNodeActive }: SidebarNodeProps) {
  const isFirstLevel = level === 1;
  const [isOpen, setIsOpen] = useState(!isFirstLevel || hasActiveChild(node));

  const id = node.resource?.label?.toLowerCase();
  const parentId = node.resource?.label ? `heading-${id}` : undefined;
  const childId = node.resource?.label ? `navigation-${id}` : undefined;

  function hasActiveChild(node: Sitemap) {
    if (!node.children) {
      return false;
    }

    const hasActiveChildRecursively = node.children.some(
      (node) => isNodeActive(node) || hasActiveChild(node)
    );

    return hasActiveChildRecursively;
  }

  return (
    <SidebarNodeWrapper node={node}>
      <>
        {node.resource?.label ? (
          <SidebarItem
            onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
            node={node}
            level={level}
            isNodeActive={isNodeActive}
            buttonProps={{
              'aria-controls': childId,
              id: parentId,
              'aria-expanded': isOpen,
            }}
          />
        ) : null}
        {node.children?.length ? (
          <ul
            role="region"
            id={childId}
            aria-labelledby={parentId}
            style={{
              display: isOpen ? 'block' : 'none',
              marginLeft: isFirstLevel ? '10px' : 0,
            }}
          >
            {node.children.map((child, index) => (
              <SidebarNode
                key={index}
                node={child}
                level={level + 1}
                isNodeActive={isNodeActive}
              />
            ))}
          </ul>
        ) : null}
      </>
    </SidebarNodeWrapper>
  );
}

type BaseProps = {
  children: React.ReactNode;
  headings: Heading[] | undefined;
};

export function Base({ children, headings }: BaseProps) {
  const { asPath } = useRouter();
  const [, setIsSidebarOpen] = useState(false);

  function isNodeActive({ href }: Node) {
    const [path] = asPath.split('#');

    return path === `/docs${resource?.path}`;
  }

  return (
    <div>
      <header>
        <Link href="/">
          <div>
            <Logo />
            <span>Dinero.js</span>
          </div>
        </Link>
        <div>
          <select>
            <option value="v2">v2.0.0</option>
            <option value="v1">v1.8.1</option>
          </select>
          <a
            href="https://github.com/dinerojs/dinero.js"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>GitHub</span>
          </a>
        </div>
      </header>
      <main>
        <nav>
          <SidebarNode node={tree} level={0} isNodeActive={isNodeActive} />
        </nav>
        {/* The <div> element captures `click` and `keyup` events to simulate clicks outside the sidebar on small screens */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          onClick={() => setIsSidebarOpen(false)}
          onKeyUp={() => setIsSidebarOpen(false)}
        >
          {children}
        </div>
        {(headings?.length ?? 0) > 0 && (
          <div>
            <h5>On this page</h5>
            <ul>
              {headings?.map(({ text, slug }) => (
                <li key={slug}>
                  <Link href={`#${slug}`}>{text}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      {/* <button
        onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
      >
        <span>Menu</span>
      </button> */}
    </div>
  );
}