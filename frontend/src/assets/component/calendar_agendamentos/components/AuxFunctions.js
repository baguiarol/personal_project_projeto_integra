import moment from "moment";

export const checkIfItsBetween = (num, intervalBegin, intervalEnd) => {
    return (num >= intervalBegin && num < intervalEnd)
}

export const checkBloqueado = (bloqueios, sala, hora, date) => {
    for (let bloqueio of bloqueios) {
        if (Array.isArray(bloqueio.sala)) {
            for (let currentSala of bloqueio.sala) {
                if (currentSala.toString() === sala._id.toString() &&
                    moment(new Date(bloqueio.dia)).add(1, 'day').isSame(date, 'day')) {
                    if (bloqueio.wholeDay) {
                        return true
                    } else if (checkIfItsBetween(hora, bloqueio.horaInicio, bloqueio.horaFim)) {
                        return true
                    }
                }
            }
        } else {
            if (bloqueio.sala.toString() === sala._id.toString() &&
                moment(new Date(bloqueio.dia)).isSame(date, 'day')) {
                if (bloqueio.wholeDay) {
                    return true
                }
            }
        }
    }
    return false
}

export const setClassStringByTheData = agendamento => {
    if ('execucao_inicio' in agendamento && !('execucao_fim' in agendamento)) {
        //Se estiver sendo executada, sempre será amarelo.
        return ' amarelo';
    } else if ((!agendamento.pago && agendamento.executado)
        || moment(new Date()).isSame(new Date(agendamento.data), 'day') && (agendamento.hora_inicio <= new Date().getHours())
        && !agendamento.pago && !agendamento.executado
        || agendamento.pago && !('execucao_inicio' in agendamento) && (moment(new Date()).isSame(agendamento.data, 'day')
            && new Date().getHours() >= agendamento.hora_inicio)
        || (!agendamento.pago && !agendamento.executado && moment(new Date()).isAfter(agendamento.data, 'day'))) {
        //Executada e não paga,
        // Não executada & não paga & o horário já passou
        // ou paga e não executada.
        return ' vermelho';
    } else if ((agendamento.executado && agendamento.pago)
        || (!agendamento.executado && agendamento.pago && !(moment(new Date()).isSame(agendamento.data, 'day')
            && new Date().getHours() >= agendamento.hora_inicio))) {
        //Executada e paga.
        //ou não executada, mas fora do período de reserva, e paga.
        return ' verde';
    }
    return '';
}