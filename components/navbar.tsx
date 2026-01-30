'use client'

import { useState, useRef, useEffect } from 'react'
import './navbar.css'

interface NavItem {
    label: string
    href: string
    sectionId: string
}

const navItems: NavItem[] = [
    { label: 'SVT', href: '#', sectionId: 'hero' },
    { label: 'About', href: '#about', sectionId: 'about' },
    { label: 'Projects', href: '#projects', sectionId: 'projects' },
    { label: 'Contact', href: '#contact', sectionId: 'contact' },
]

export function Navbar() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isHovering, setIsHovering] = useState(false)
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const [restBubbleStyle, setRestBubbleStyle] = useState({ left: 0, width: 0 })
    const [activeBubbleStyle, setActiveBubbleStyle] = useState({ left: 0, width: 0 })
    const navRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

    // Calculate bubble position for a single element
    const getItemPosition = (index: number) => {
        const item = itemRefs.current[index]
        const nav = navRef.current
        if (!item || !nav) return { left: 0, width: 0 }

        const navRect = nav.getBoundingClientRect()
        const itemRect = item.getBoundingClientRect()

        return {
            left: itemRect.left - navRect.left,
            width: itemRect.width,
        }
    }

    // Calculate full-width bubble position (spans all items)
    const getFullWidthPosition = () => {
        const nav = navRef.current
        const firstItem = itemRefs.current[0]
        const lastItem = itemRefs.current[navItems.length - 1]

        if (!nav || !firstItem || !lastItem) return { left: 0, width: 0 }

        const navRect = nav.getBoundingClientRect()
        const firstRect = firstItem.getBoundingClientRect()
        const lastRect = lastItem.getBoundingClientRect()

        return {
            left: firstRect.left - navRect.left,
            width: (lastRect.right - firstRect.left),
        }
    }

    // Scroll spy - detect which section is in view
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150 // Offset for navbar height

            // Check if at top of page (hero section)
            if (scrollPosition < 300) {
                setActiveIndex(0)
                return
            }

            // Find which section is currently in view
            for (let i = navItems.length - 1; i >= 0; i--) {
                const sectionId = navItems[i].sectionId
                if (sectionId === 'hero') continue

                const section = document.getElementById(sectionId)
                if (section) {
                    const sectionTop = section.offsetTop
                    if (scrollPosition >= sectionTop) {
                        setActiveIndex(i)
                        return
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Run on mount

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Update rest bubble position based on hover state
    useEffect(() => {
        const updatePosition = () => {
            if (isHovering && hoverIndex !== null) {
                setRestBubbleStyle(getItemPosition(hoverIndex))
            } else {
                setRestBubbleStyle(getFullWidthPosition())
            }
        }

        updatePosition()
        window.addEventListener('resize', updatePosition)
        return () => window.removeEventListener('resize', updatePosition)
    }, [isHovering, hoverIndex])

    // Update active bubble position
    useEffect(() => {
        const updateActivePosition = () => {
            setActiveBubbleStyle(getItemPosition(activeIndex))
        }

        updateActivePosition()
        window.addEventListener('resize', updateActivePosition)
        return () => window.removeEventListener('resize', updateActivePosition)
    }, [activeIndex])

    // Handle hover on individual items
    const handleMouseEnter = (index: number) => {
        setIsHovering(true)
        setHoverIndex(index)
    }

    // Handle mouse leaving the entire nav
    const handleNavMouseLeave = () => {
        setIsHovering(false)
        setHoverIndex(null)
    }

    // Handle click - smooth scroll
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
        e.preventDefault()

        const href = navItems[index].href
        if (href !== '#') {
            const element = document.querySelector(href)
            if (element) {
                // Custom offset per section (positive = more space above, negative = less space above)
                const sectionOffsets: Record<string, number> = {
                    '#about': 70,      // Tweak this value for About section
                    '#projects': 10,    // Tweak this value for Projects section
                    '#contact': 10,     // Tweak this value for Contact section
                }
                const offset = sectionOffsets[href] || 0
                const elementPosition = element.getBoundingClientRect().top + window.scrollY
                window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' })
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <nav className="navbar-container">
            <div className="nav-wrap">
                <div
                    className="nav"
                    ref={navRef}
                    onMouseLeave={handleNavMouseLeave}
                >
                    {/* Rest bubble - grey, full width at rest, shrinks on hover */}
                    <div
                        className="bubble rest"
                        style={{
                            left: restBubbleStyle.left,
                            width: restBubbleStyle.width,
                            transform: 'translateY(-50%)',
                            top: '50%',
                            height: 'calc(100% - 4px)',
                        }}
                    />

                    {/* Active bubble - white, shows selected item */}
                    <div
                        className="bubble active"
                        style={{
                            left: activeBubbleStyle.left,
                            width: activeBubbleStyle.width,
                            transform: 'translateY(-50%)',
                            top: '50%',
                            height: 'calc(100% - 4px)',
                        }}
                    />

                    {/* Nav items */}
                    {navItems.map((item, index) => (
                        <a
                            key={item.label}
                            ref={el => { itemRefs.current[index] = el }}
                            href={item.href}
                            className={index === activeIndex ? 'active' : ''}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onClick={(e) => handleClick(e, index)}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    )
}
