const DataObserver = (init) => {
    let data = init
    let observers = [] 
    return {
        data: () => data,
        setData: fn => {data = fn(data)},
        addListener: fn => observers.push(fn),
        notify: () => observers.forEach(fn => fn(data))
    };
}

export default DataObserver