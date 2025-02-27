import {
  ArrowDownTrayIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { Link, Tooltip } from '@mui/material'

import { useState } from 'react'
import { useSetAtom, useAtom } from 'jotai'

import axios from 'axios'

import Plot, { PlotParams } from 'react-plotly.js'
import { file, plots, viewPayload } from '../contexts/UploadContext'
import { NavLink } from 'react-router-dom'

export const View = () => {
  const setPlots = useSetAtom(plots)
  const [fileAtom] = useAtom(file)
  const [plotsAtom] = useAtom(plots)
  const [viewPayloadAtom] = useAtom(viewPayload)
  const [sliderIndex, setSliderIndex] = useState<number>(0)
  const [indexCounter, setIndexCounter] = useState<number[]>([])

  const getPlot = async (endpoint: string) => {
    return axios.post(endpoint, {}).then((res) => res.data)
  }

  const handleRightArrow = (sliderIndex: number) => {
    const index: number = sliderIndex + 1

    if (!indexCounter.includes(index)) {
      getPlot(`/${viewPayloadAtom[index].figure}`).then((value: PlotParams) => {
        setPlots([...plotsAtom, value])

        setIndexCounter([...indexCounter, index])
        setSliderIndex((prevIndex) => prevIndex + 1)
      })
    }

    if (indexCounter.includes(index)) {
      setSliderIndex((prevIndex) => prevIndex + 1)
    }
  }

  const handleLeftArrow = () => {
    setSliderIndex((prevIndex) => prevIndex - 1)
  }

  return (
    <div className="w-full h-full flex justify-end items-center">
      <nav className="h-1/3 w-[4%]  border-[#A456F0] border-r flex flex-col items-center justify-evenly">
        <NavLink
          to={'/'}
          className=" text-primary hover:cursor-pointer hover:text-white h-8 w-8"
        >
          <HomeIcon />
        </NavLink>

        <NavLink
          to={'/isearch'}
          className=" text-primary hover:cursor-pointer hover:text-white h-8 w-8"
        >
          <MagnifyingGlassIcon />
        </NavLink>
      </nav>
      <section className="h-full w-[92%]">
        <>
          <div className="w-full h-[95%] flex justify-center items-center">
            {plotsAtom.map((figure: PlotParams, index: number) => {
              if (index === sliderIndex) {
                return (
                  <div className="px-4 py-2 w-full h-full flex flex-col justify-center items-center">
                    <Plot
                      key={index}
                      data={figure.data}
                      layout={figure.layout}
                    />
                  </div>
                )
              }
            })}
          </div>
          <div className="w-full h-[5%] inline-flex justify-center">
            <ChevronDoubleLeftIcon
              color={sliderIndex !== 0 ? 'white' : 'gray'}
              height={20}
              width={20}
              className={`mr-2  ${
                sliderIndex !== 0 && 'hover:scale-125 hover:cursor-pointer'
              }`}
              onClick={() => sliderIndex !== 0 && handleLeftArrow()}
            />
            <ChevronDoubleRightIcon
              color={
                viewPayloadAtom.length - 1 !== sliderIndex ? 'white' : 'gray'
              }
              height={20}
              width={20}
              className={` ${
                viewPayloadAtom.length - 1 !== sliderIndex &&
                'hover:scale-125 hover:cursor-pointer'
              }`}
              onClick={() =>
                viewPayloadAtom.length - 1 !== sliderIndex &&
                handleRightArrow(sliderIndex)
              }
            />
          </div>
        </>
      </section>
      <nav className="h-1/3 w-[4%]  border-[#A456F0] border-l flex flex-col items-center justify-evenly">
        <NavLink
          to={'/iprofile'}
          className=" text-primary hover:cursor-pointer hover:text-white h-8 w-8"
        >
          <UserCircleIcon />
        </NavLink>

        <Tooltip title="Download file" arrow>
          <Link href={`/downloading/${fileAtom}`} target="_blank">
            <ArrowDownTrayIcon
              className={`h-8 w-8 text-[#A456F0] hover:cursor-pointer hover:text-white`}
            />
          </Link>
        </Tooltip>
      </nav>
    </div>
  )
}
