import { useEffect, useState, useRef } from 'react'
import Phone from '@mui/icons-material/Phone'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import pizza from './pizza.webp'
import wine from './wine.jpg'
import parm from './parm.jpg'

import './index.sass'

function LocationBar() {
  return (
    <div className="location-bar">
      5490 W Centinela Ave, Westchester, CA 90045 <Button sx={{ padding: 0 }} variant='text' href="tel:310-670-8122"><Phone /> (310) 670-8122</Button>
    </div >
  )
}

interface HeaderButtonProps {
  content: string,
  emphasized?: boolean
}

function HeaderButton({ content, emphasized = false }: HeaderButtonProps) {
  return (
    <Button variant={!emphasized ? 'text' : 'contained'}>
      {content}
    </Button>
  )
}

interface ImageCarouselDotsProps {
  len: number,
  idx?: number
}

function ImageCarouselDots({ len, idx = 0 }: ImageCarouselDotsProps) {
  function Dot(props: { on?: boolean }) {
    return (
      <div className="carousel-dot" {...props?.on && { "data-on": true }}>&bull;</div>
    )
  }

  const dots = new Array(len)

  for (let i = 0; i < len; i++) {
    dots[i] = <Dot on={i === idx} />
  }

  return (
    <div className="carousel-dots">
      {dots}
    </div>
  )
}

interface ImageCarouselProps {
  images: {
    url: string,
    description: string
  }[],
  startIdx?: number
}

const IMAGES = [
  {
    url: pizza,
    description: 'This is pizza!'
  },
  {
    url: wine,
    description: 'Some of our specialty wines'
  },
  {
    url: parm,
    description: 'Check out our freshly-grated cheese'
  }
]

function rollover(dir: "up" | "down", value: number, limit: number) {
  if (dir === "up") {
    return ++value > limit ? 0 : value 
  } else {
    return --value < 0 ? limit : value
  }
}

function useRollover(size: number, initial: number = 0): [number, () => void, () => void] {
  const [state, setState] = useState(initial)

  function inc() {
    // let ret
    setState(state => rollover("up", state, size))
    // alert(ret)
    // return ret
  }

  function dec() {
    // let ret
    setState(state => rollover("down", state, size))
    // alert(ret)
    // return ret
  }

  return [state, inc, dec]
}

/**
 * BOTTOM > TOP
 * @fade-out(TOP) & @fade-in(BOTTOM)
 * TOP = BOTTOM
 * BOTTOM = next()
 */
function ImageCarousel({ images, startIdx = 0 }: ImageCarouselProps) {
  const [currentIdx, inc, dec] = useRollover(images.length - 1, startIdx)

  const [switching, setSwitching] = useState(false)
  
  const newSrc = useRef<null | string>(null)
  const timeoutId = useRef<any>(null)

  useEffect(() => {
    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  function advance() {
    if (switching) return
    
    setSwitching(true)
    newSrc.current = images[rollover("up", currentIdx, images.length - 1)].url
    
    timeoutId.current = setTimeout(() => {
      inc()
      setSwitching(false)
    }, 500)
  }

  function retract() {
    if (switching) return
    
    setSwitching(true)
    newSrc.current = images[rollover("down", currentIdx, images.length - 1)].url
    
    timeoutId.current = setTimeout(() => {
      dec()
      setSwitching(false)
    }, 500)
  }

  return (
    <div className="image-carousel landing-content-spacing">
      <div role="img" className={switching ? "fade-out" : ""} style={{ backgroundImage: `url(${images[currentIdx].url})`, height: '100%', backgroundPosition: 'center top', backgroundSize: '100% auto' }}></div>
      {switching && (
        <div role="img" className={switching ? "fade-in" : ""} style={{ backgroundImage: `url(${newSrc.current})`,   position: 'absolute', zIndex: 2, top: 0, width: '100%', left: 0, /*backgroundColor: "red",*/ height: '100%', backgroundPosition: 'center top', backgroundSize: '100% auto' }}>a</div>
      )}

      <div className="image-carousel-blurb important-left-items">
        {images[currentIdx].description}
      </div>

      <IconButton onClick={advance} sx={{
        position: 'absolute',
        zIndex: 10,
        top: '50%',
        bottom: '50%',
        right: 0,
      }}>
        <ArrowForwardIosIcon />
      </IconButton>
      
      <IconButton onClick={retract} sx={{
        position: 'absolute',
        zIndex: 10,
        top: '50%',
        bottom: '50%',
        left: 0
      }}>
        <ArrowBackIosIcon />
      </IconButton>
      
      <ImageCarouselDots len={images.length} idx={currentIdx} />
    </div >
  )
}

function Header() {
  return (
    <div className='landing-header landing-content-spacing'>
      <div className='header-logo important-left-items'>
        Compari's
      </div>
      <nav id="header-items">
        <HeaderButton content='Menu' emphasized />
        <HeaderButton content='Our Story' />
        <HeaderButton content='Hours' />
      </nav>
    </div>
  )
}

export default function Landing() {
  return (
    <main className="landing">
      <section id="top">
        <LocationBar />
        <Header />

        <ImageCarousel images={IMAGES} />
      </section>
      <section>
        tbd
      </section>
    </main>
  )
}