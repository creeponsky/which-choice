import type { Config } from "tailwindcss"

const config = {
	darkMode: ["class"],
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	extend: {
		animation: {
			fadeIn: 'fadeIn 0.3s ease-in-out',
		},
		keyframes: {
			fadeIn: {
				'0%': { opacity: '0' },
				'100%': { opacity: '1' },
			},
		},
	},
	prefix: "",
	theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			sm: '576px',
    			'sm-max': {
    				max: '576px'
    			},
    			md: '768px',
    			'md-max': {
    				max: '768px'
    			},
    			lg: '992px',
    			'lg-max': {
    				max: '992px'
    			},
    			xl: '1200px',
    			'xl-max': {
    				max: '1200px'
    			},
    			'2xl': '1320px',
    			'2xl-max': {
    				max: '1320px'
    			},
    			'3xl': '1600px',
    			'3xl-max': {
    				max: '1600px'
    			},
    			'4xl': '1850px',
    			'4xl-max': {
    				max: '1850px'
    			}
    		}
    	},
    	extend: {
    		fontFamily: {
    			jakarta: [
    				'ui-sans-serif',
    				'system-ui',
    				'sans-serif',
    				'Apple Color Emoji',
    				'Segoe UI Emoji',
    				'Segoe UI Symbol',
    				'Noto Color Emoji'
    			],
    			poppins: [
    				'Poppins',
    				'sans-serif'
    			],
    			code: [
    				'var(--font-mono)'
    			],
    			regular: [
    				'var(--font-body)'
    			]
    		},
    		height: {
    			'300px': '300px',
    			'500px': '500px',
    			sidebar: 'calc(100vh - 32px)'
    		},
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			brand: {
    				DEFAULT: 'hsl(var(--brand))',
    				foreground: 'hsl(var(--brand-foreground))'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		borderRadius: {
    			'2xl': 'calc(var(--radius) + 4px)',
    			xl: 'calc(var(--radius) + 2px)',
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			marquee: {
    				from: {
    					transform: 'translateX(0)'
    				},
    				to: {
    					transform: 'translateX(calc(-100% - var(--gap)))'
    				}
    			},
    			appear: {
    				'0%': {
    					opacity: '0',
    					transform: 'translateY(1rem)',
    					filter: 'blur(.5rem)'
    				},
    				'50%': {
    					filter: 'blur(0)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'translateY(0)',
    					filter: 'blur(0)'
    				}
    			},
    			'appear-zoom': {
    				'0%': {
    					opacity: '0',
    					transform: 'scale(.5)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'scale(1)'
    				}
    			},
    			'pulse-hover': {
    				'0%': {
    					opacity: '1',
    					transform: 'translateY(0)'
    				},
    				'50%': {
    					opacity: '0.5',
    					transform: 'translateY(-1rem)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'translateY(0)'
    				}
    			},
    			hover: {
    				'0%': {
    					transform: 'translateY(0) translateX(0)'
    				},
    				'50%': {
    					transform: 'translateY(-1rem) translateX(1rem)'
    				},
    				'100%': {
    					transform: 'translateY(0) translateX(0)'
    				}
    			},
    			'hover-reverse': {
    				'0%': {
    					transform: 'translateY(0) translateX(0)'
    				},
    				'50%': {
    					transform: 'translateY(1rem) translateX(1rem)'
    				},
    				'100%': {
    					transform: 'translateY(0) translateX(0)'
    				}
    			},
    			'pulse-fade': {
    				'0%': {
    					opacity: '1'
    				},
    				'50%': {
    					opacity: '0.3'
    				},
    				'100%': {
    					opacity: '1'
    				}
    			},
    			'background-position-spin': {
    				'0%': {
    					backgroundPosition: 'top center'
    				},
    				'100%': {
    					backgroundPosition: 'bottom center'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			appear: 'appear 0.6s forwards ease-out',
    			'appear-zoom': 'appear-zoom 0.6s forwards ease-out',
    			'pulse-hover': 'pulse-hover 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    			'background-position-spin': 'background-position-spin 3000ms infinite alternate'
    		},
    		spacing: {
    			container: '1280px'
    		},
    		boxShadow: {
    			'glow-sm': '0 0 16px 0 hsla(var(--foreground) / 0.08) inset',
    			'glow-md': '0 0 32px 0 hsla(var(--foreground) / 0.08) inset',
    			'glow-lg': '0 0 64px 0 hsla(var(--foreground) / 0.06) inset'
    		}
    	}
    },
} satisfies Config

export default config