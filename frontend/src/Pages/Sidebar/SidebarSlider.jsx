import React, { useState } from 'react'
import { RightKSidebar } from './StyledSidebar'
import { DarkButton, PurpleButton } from '../Button/StyledButton'
import UpcomingBirthdays from '../AddEmployee/UpcomingBirthdays'
import NoticeBoard from '../../Component/HrManager/Notification/NoticeBoard'
import { MdCreateNewFolder } from 'react-icons/md'
import HolidayList from '../LeaveCalendar/HolidayList'

const SidebarSlider = () => {
    const [isDark, setIsDark] = useState("Light")
    const [modeButton, setModeButton] = useState("🌞 Light")
    const [isOpen, setIsOpen] = useState("Open")

    const changeMode = () => {
        if (isDark === 'Dark' && modeButton === "🌚 Dark") {
            setIsDark("Light")
            setModeButton("🌞 Light")
        }
        if (isDark === "Light" && modeButton === "🌞 Light") {
            setIsDark("Dark")
            setModeButton("🌚 Dark")
        }
    }
    const openSidebar = () => {
        if (isOpen === 'Close') {
            setIsOpen("Open")
        }
        if (isOpen === "Open") {
            setIsOpen("Close")
        }
    }
    return (
        <div>
            <RightKSidebar Open={isOpen} Mode={isDark}>
                <div className='d-flex flex-column gap-4 pb-5' style={{ position: "relative", maxHeight: '100vh', overflowY: "auto", overflowX: "initial" }}>
                    <div className='rounded-4' style={{ minWidth: '200px', maxWidth: '300px' }}>
                        <NoticeBoard />
                    </div>
                    <div className='rounded-4' style={{ minWidth: '200px', maxWidth: '300px' }}>
                        <UpcomingBirthdays />
                    </div>
                    <div className='rounded-4' style={{ minWidth: '200px', maxWidth: '300px' }}>
                        <HolidayList
                            title={"Holiday List"}
                            newFolderLink={"/hr/holiday"}
                            holidayIcons={<MdCreateNewFolder />}
                        />
                    </div>
                </div>
                <DarkButton class="spinner-border" onClick={openSidebar} style={{ padding: '.5rem', position: 'absolute', left: '-17%', bottom: '50%', borderRadius: '50px 0px 0px 50px' }}>
                    🪄
                </DarkButton>
            </RightKSidebar >

        </div >
    )
}

export default SidebarSlider
