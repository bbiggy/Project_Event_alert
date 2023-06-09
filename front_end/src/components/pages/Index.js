/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin, { Draggable } from "@fullcalendar/interaction" // needed for dayClick
import timeGridPlugin from '@fullcalendar/timegrid'

import moment from 'moment'

import { Col, Row, Modal, Card, Tag } from 'antd';

// Functions
import { createEvent, listEvent, handleCurrentMonth, updateImage, updateEvent, removeEvent} from '../functions/fullcalendar';

// CSS
import './Index.css'

const Index = () => {
    const [modal1Open, setModal1Open] = useState(false);
    const [modal2Open, setModal2Open] = useState(false);
    const [values, setValues] = useState({
        title: '',
        start: '',
        end: '',
        color: ''
    })

    const [events, setEvents] = useState([])
    const [currentEvent, setCurrentEvent] = useState([])

    const [id, setId] = useState('')
    const [file, setFile] = useState('')
    const [image, setImage] = useState('')
    const localhost_image = process.env.REACT_APP_IMAGE + image;

    const tag = [
        { id: '1', tag: 'นักศึกษาปี 63', color: '#EA3109' },
        { id: '2', tag: 'นักศึกษาปี 64', color: '#F4F' },
        { id: '3', tag: 'นักศึกษาปี 65', color: '#8911FC' },
        { id: '4', tag: 'ครู', color: '#2874A6' },
    ]

    const dataFetchedRef = useRef(false);

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        loadData();
        drag();
        console.log('app effect');
    }, [])
    const loadData = () => {
        listEvent()
            .then(res => {
                setEvents(res.data);
            }).catch(err => {
                console.log(err);
            })
    }

    const handleRecieve = (eventInfo) => {
        console.log(eventInfo)
        let value = {
            id: eventInfo.draggedEl.getAttribute("id"),
            title: eventInfo.draggedEl.getAttribute("title"),
            color: eventInfo.draggedEl.getAttribute("color"),
            start: eventInfo.dateStr,
            end: moment(eventInfo.dateStr).add(+1, "days").format('YYYY-MM-DD')
        }
        console.log('value', value);
        createEvent(value)
            .then(res => {

            }).catch(err => {
                console.log(err)
            })
    }

    const currentMonth = (info) => {
        console.log(info.view.calendar.currentDataManager.data.currentDate)
        const m = info.view.calendar.currentDataManager.data.currentDate
        const month = moment(m).format('M')
        handleCurrentMonth({ month })
            .then(res => {
                setCurrentEvent(res.data);
            }).catch(err => {
                console.log(err);
            })
    }

    const handleSelect = (info) => {
        showModal();
        console.log(info);
        setValues({
            ...values,
            start: info.startStr,
            end: info.endStr
        })
    }

    // Handle move
    const handleChange = (info) => {
        //console.log(info.event._def.extendedProps._id, info.event.startStr, info.event.endStr)
        const values = {
            id: info.event._def.extendedProps._id,
            start: info.event.startStr,
            end: info.event.endStr
        }
        updateEvent(values)
            .then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
    }

    const drag = () => {
        let draggable = document.getElementById("external_event");
        new Draggable(draggable, {
            itemSelector: ".focus_event",
            eventData: function (eventEle) {
                let id = eventEle.getAttribute("id")
                let title = eventEle.getAttribute("title")
                let color = eventEle.getAttribute("color")

                return {
                    id: id,
                    title: title,
                    color: color
                }
            }
        })
    }

    const handleClick = (info) => {
        showModal2();
        const id = info.event._def.extendedProps._id
        setId(id);
        setImage(info.event._def.extendedProps.filename);
    }
    console.log(image);

    const handleRemove = () => {
        removeEvent(id)
            .then(res => {
                //code
                loadData()
                console.log(res)
            }).catch(err => {
                //error
                console.log(err)
            })
        setModal2Open(false);
    }

    const onChangeValues = (event_name) => {
        console.log(event_name.target.value);
        setValues({ ...values, [event_name.target.name]: event_name.target.value })
    }

    const showModal = () => {
        setModal1Open(true);
    };

    const handleOk = () => {
        console.log(values)
        createEvent(values)
            .then(res => {
                setValues({ ...values, title: '' });
                loadData();
            }).catch(err => {
                console.log(err)
            })
        setModal1Open(false);
    };

    const handleCancel = () => {
        setValues({ ...values, title: '' });
        setModal1Open(false);
    };

    const handleFile = (e) => {
        const fileIn = e.target.files[0]
        setFile(fileIn);
    }
    const showModal2 = () => {
        setModal2Open(true);
    };

    const handleOk2 = () => {
        console.log(id, file);
        const formData = new FormData();
        formData.append('id', id)
        formData.append('file', file)
        updateImage(formData)
            .then(res => {
                loadData();
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        setModal2Open(false);
    };

    const handleCancel2 = () => {
        setImage('');
        setModal2Open(false);
    };

    const d = moment(new Date()).format('DD/MM/YYYY');
    const r = new Date();
    const filterData = currentEvent.filter((item) => {
        return d === moment(item.start).format('DD/MM/YYYY')
    })

    const betweenDate = currentEvent.filter(item => {
        return r >= moment(item.start) && r < moment(item.end)
    })
    console.log('between', betweenDate)

    return (
        <>
            <Row>
                <Col span={6}>
                    <Card>
                        <div id="external_event">
                            <ul>
                                {tag.map((item, index) =>
                                    <ol
                                        className="focus_event"
                                        id={item.id}
                                        title={item.tag}
                                        color={item.color}
                                        key={index}
                                        style={{ backgroundColor: item.color }}>{item.tag}
                                    </ol>
                                )}
                            </ul>
                        </div>
                    </Card>
                    <Card>
                        <ul>
                            {currentEvent.map((item, index) =>
                                <li key={index}>
                                    {d === moment(item.start).format('DD/MM/YYYY')
                                        ? <>{moment(item.start).format('DD/MM/YYYY') + "-" + item.title}<Tag color="green">วันนี้</Tag></>
                                        : r >= moment(item.start) && r < moment(item.end)
                                            ? <>{moment(item.start).format('DD/MM/YYYY') + "-" + item.title}<Tag color="yellow">กำลังดำเนินการ</Tag></>
                                            : <>{moment(item.start).format('DD/MM/YYYY') + "-" + item.title}</>
                                    }
                                </li>
                            )}
                        </ul>
                    </Card>
                </Col>
                <Col span={18}>
                    <h1>Calendar</h1>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        events={events}
                        selectable={true}
                        select={handleSelect}
                        drop={handleRecieve}
                        datesSet={currentMonth}
                        eventClick={handleClick}
                        editable={true}
                        eventChange={handleChange}
                    />
                    <Modal title="[รายละเอียดข้อมูล]" open={modal1Open} onOk={handleOk} onCancel={handleCancel}>
                        <p><input placeholder='กรุณากรอกข้อมูล...' name="title" value={values.title} onChange={onChangeValues} /></p>
                        <p><select name='color' onChange={onChangeValues}>
                            <option key={999} value='' >--กรุณาเลือกชั้นปี--</option>
                            {tag.map((item, index) =>
                                <option key={index} value={item.color} style={{ backgroundColor: item.color }}>{item.tag}</option>
                            )}
                        </select></p>
                    </Modal>
                    <Modal title="[ภาพถ่ายกิจกรรม]" open={modal2Open} onOk={handleOk2} onCancel={handleCancel2}
                        footer={[
                            <button onClick={handleOk2} >Submit</button>,
                            <button onClick={handleCancel2} >Cancel</button>,
                            <button onClick={handleRemove} >Delete</button>
                        ]}
                    >
                        <img src={process.env.REACT_APP_IMAGE + image} alt="" width="100%" />
                        <input type="file" onChange={handleFile} name="file" />
                    </Modal>
                </Col>
            </Row>
        </>
    )
}

export default Index
